import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List as ImmutableList } from 'immutable'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import getSortBy from '../utils/group_sort_by'
import { connectGroupStream } from '../actions/streaming'
import {
	clearTimeline,
	expandGroupTimeline,
	expandGroupFeaturedTimeline,
} from '../actions/timelines'
import {
	setGroupTimelineSort,
} from '../actions/groups'
import {
	GROUP_TIMELINE_SORTING_TYPE_NEWEST,
} from '../constants'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'
import GroupSortBlock from '../components/group_sort_block'

class GroupTimeline extends ImmutablePureComponent {

	state = {
		//keep track of loads for if no user, 
		//only allow 2 loads before showing sign up msg
		loadCount: 0,
	}
	
	componentDidMount() {
		const {
			groupId,
			sortByValue,
			sortByTopValue,
			onlyMedia,
		} = this.props

		if (sortByValue !== GROUP_TIMELINE_SORTING_TYPE_NEWEST) {
			this.props.setMemberNewest()
		} else {
			const sortBy = getSortBy(sortByValue, sortByTopValue, onlyMedia)

			this.props.onExpandGroupFeaturedTimeline(groupId)
			this.props.onExpandGroupTimeline(groupId, { sortBy, onlyMedia })

			if (!!me) {
				this.disconnect = this.props.onConnectGroupStream(groupId)
			}
		}
	}

	componentDidUpdate(prevProps) {
		if ((prevProps.sortByValue !== this.props.sortByValue ||
				prevProps.sortByTopValue !== this.props.sortByTopValue ||
				prevProps.onlyMedia !== this.props.onlyMedia) &&
				prevProps.groupId === this.props.groupId) {
			this.handleLoadMore()
			this.props.onClearTimeline(`group:${this.props.groupId}`)
		}

		if (prevProps.groupId !== this.props.groupId) {
			this.props.onExpandGroupFeaturedTimeline(this.props.groupId)
		}
	}

	componentWillUnmount() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	handleLoadMore = (maxId) => {
		const {
			groupId,
			sortByValue,
			sortByTopValue,
			onlyMedia,
		} = this.props

		const sortBy = getSortBy(sortByValue, sortByTopValue)
		this.props.onExpandGroupTimeline(groupId, { sortBy, maxId, onlyMedia })
	}

	render() {
		const {
			group,
			groupId,
			intl,
			groupPinnedStatusIds,
		} = this.props

		if (typeof group === 'undefined') {
			return <ColumnIndicator type='loading' />
		} else if (group === false) {
			return <ColumnIndicator type='missing' />
		}

		return (
			<React.Fragment>
				<GroupSortBlock />
				<StatusList
					scrollKey={`group-timeline-${groupId}`}
					timelineId={`group:${groupId}`}
					onLoadMore={this.handleLoadMore}
					groupPinnedStatusIds={groupPinnedStatusIds}
					emptyMessage={intl.formatMessage(messages.empty)}
				/>
			</React.Fragment>
		)
	}

}

const messages = defineMessages({
	empty: { id: 'empty_column.group', defaultMessage: 'There is nothing in this group yet.\nWhen members of this group post new statuses, they will appear here.' },
})

const emptyList = ImmutableList()

const mapStateToProps = (state, props) => ({
	groupId: props.params.id,
	group: state.getIn(['groups', props.params.id]),
	groupPinnedStatusIds: state.getIn(['timelines', `group:${props.params.id}:pinned`, 'items'], emptyList),
	sortByValue: state.getIn(['group_lists', 'sortByValue']),
	sortByTopValue: state.getIn(['group_lists', 'sortByTopValue']),
})

const mapDispatchToProps = (dispatch) => ({
	onConnectGroupStream(groupId) {
		dispatch(connectGroupStream(groupId))
	},
	onClearTimeline(timelineId) {
		dispatch(clearTimeline(timelineId))
	},
	onExpandGroupTimeline(groupId, options) {
		dispatch(expandGroupTimeline(groupId, options))
	},
	setMemberNewest() {
		dispatch(setGroupTimelineSort(GROUP_TIMELINE_SORTING_TYPE_NEWEST))
	},
	onExpandGroupFeaturedTimeline(groupId) {
		dispatch(expandGroupFeaturedTimeline(groupId))
	},
})

GroupTimeline.propTypes = {
	params: PropTypes.object.isRequired,
	group: PropTypes.oneOfType([
		ImmutablePropTypes.map,
		PropTypes.bool,
	]),
	groupId: PropTypes.string,
	intl: PropTypes.object.isRequired,
	onConnectGroupStream: PropTypes.func.isRequired,
	onClearTimeline: PropTypes.func.isRequired,
	onExpandGroupTimeline: PropTypes.func.isRequired,
	onExpandGroupFeaturedTimeline: PropTypes.func.isRequired,
	setMemberNewest: PropTypes.func.isRequired,
	sortByValue: PropTypes.string.isRequired,
	sortByTopValue: PropTypes.string,
	onlyMedia: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupTimeline))