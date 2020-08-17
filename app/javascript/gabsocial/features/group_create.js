import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import {
	changeGroupTitle,
	changeGroupDescription,
	changeGroupCoverImage,
	changeGroupId,
	changeGroupTags,
	changeGroupCategory,
	changeGroupIsPrivate,
	changeGroupIsVisible,
	submit,
	setGroup,
	resetEditor,
} from '../actions/group_editor'
import { closeModal } from '../actions/modal'
import { fetchGroup } from '../actions/groups'
import { fetchGroupCategories } from '../actions/group_categories'
import ColumnIndicator from '../components/column_indicator'
import Button from '../components/button'
import Divider from '../components/divider'
import Input from '../components/input'
import Text from '../components/text'
import Form from '../components/form'
import Switch from '../components/switch'
import Select from '../components/select'
import Textarea from '../components/textarea'
import FileInput from '../components/file_input'

const messages = defineMessages({
	title: { id: 'groups.form.title', defaultMessage: 'Title' },
	idTitle: { id: 'groups.form.id_title', defaultMessage: 'Unique id' },
	idDescription: { id: 'groups.form.id_description', defaultMessage: 'A unique id that links to this group. (Cannot be changed)' },
	tagsTitle: { id: 'groups.form.tags_title', defaultMessage: 'Tags' },
	tagsDescription: { id: 'groups.form.tags_description', defaultMessage: 'Add tags seperated by commas to increase group visibility' },
	categoryTitle: { id: 'groups.form.category_title', defaultMessage: 'Category' },
	categoryDescription: { id: 'groups.form.category_description', defaultMessage: 'Add a general category for your group' },
	description: { id: 'groups.form.description', defaultMessage: 'Enter the group description' },
	coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Upload a banner image' },
	coverImageDescription: { id: 'groups.form.coverImage_description', defaultMessage: 'Accepted image types: .jpg, .png' },
	coverImageChange: { id: 'groups.form.coverImageChange', defaultMessage: 'Banner image selected' },
	create: { id: 'groups.form.create', defaultMessage: 'Create group' },
	update: { id: 'groups.form.update', defaultMessage: 'Update group' },
	titlePlaceholder: { id: 'groups.form.title_placeholder', defaultMessage: 'New group title...' },
	descriptionPlaceholder: { id: 'groups.form.description_placeholder', defaultMessage: 'This group is about...' },
	isPrivateDescription: { id: 'groups.form.is_private_description', defaultMessage: 'Only members can see group posts.' },
	isVisibleDescription: { id: 'groups.form.is_visible_description', defaultMessage: 'Anyone can find a visible group in search and other places on Gab.' },
})

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])
	let isAdmin = false

	if (groupId) {
		const relationships = state.getIn(['group_relationships', groupId])
		if (relationships) {
			isAdmin = relationships.get('admin')
		}
	}

	return {
		group,
		groupId,
		isAdmin,
		error: (groupId && !group) || (group && !isAdmin),
		titleValue: state.getIn(['group_editor', 'title']),
		descriptionValue: state.getIn(['group_editor', 'description']),
		coverImage: state.getIn(['group_editor', 'coverImage']),
		isSubmitting: state.getIn(['group_editor', 'isSubmitting']),
		idValue: state.getIn(['group_editor', 'id']),
		tags: state.getIn(['group_editor', 'tags']),
		category: state.getIn(['group_editor', 'category']),
		isPrivate: state.getIn(['group_editor', 'isPrivate']),
		isVisible: state.getIn(['group_editor', 'isVisible']),
		categories: state.getIn(['group_categories', 'items']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onTitleChange(value) {
		dispatch(changeGroupTitle(value))
	},
	onDescriptionChange(value) {
		dispatch(changeGroupDescription(value))
	},
	onCoverImageChange(imageData) {
		dispatch(changeGroupCoverImage(imageData))
	},
	onChangeGroupId(value) {
		dispatch(changeGroupId(value))
	},
	onChangeGroupTags(value) {
		dispatch(changeGroupTags(value))
	},
	onChangeGroupCategory(e) {
		dispatch(changeGroupCategory(e.target.value))
	},
	onChangeGroupIsPrivate(value) {
		dispatch(changeGroupIsPrivate(value))
	},
	onChangeGroupIsVisible(value) {
		dispatch(changeGroupIsVisible(value))
	},
	onResetEditor() {
		dispatch(resetEditor())
	},
	onSetGroup(group) {
		dispatch(setGroup(group))
	},
	onSubmit(routerHistory) {
		dispatch(submit(routerHistory))
		dispatch(closeModal())
	},
	onFetchGroup(groupId) {
		dispatch(fetchGroup(groupId))
	},
	onFetchGroupCategories() {
		dispatch(fetchGroupCategories())
	}
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupCreate extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		group: ImmutablePropTypes.map,
		titleValue: PropTypes.string.isRequired,
		descriptionValue: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onDescriptionChange: PropTypes.func.isRequired,
		onChangeGroupId: PropTypes.func.isRequired,
		onChangeGroupTags: PropTypes.func.isRequired,
		onChangeGroupCategory: PropTypes.func.isRequired,
		onChangeGroupIsPrivate: PropTypes.func.isRequired,
		onChangeGroupIsVisible: PropTypes.func.isRequired,
		onFetchGroup: PropTypes.func.isRequired,
		onFetchGroupCategories: PropTypes.func.isRequired,
		onResetEditor: PropTypes.func.isRequired,
		onSetGroup: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		isSubmitting: PropTypes.bool,
		isAdmin: PropTypes.bool,
		onClose: PropTypes.func,
		idValue: PropTypes.string.isRequired,
		tags: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		isPrivate: PropTypes.bool.isRequired,
		isVisible: PropTypes.bool.isRequired,
		categories: ImmutablePropTypes.list.isRequired,
	}

	componentDidMount() {
		const { groupId, group } = this.props

		this.props.onFetchGroupCategories()

		if (!group) {
			if (groupId) {
				this.props.onFetchGroup(groupId)
			} else {
				this.props.onResetEditor()
			}
		} else {
			this.props.onSetGroup(group)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.group !== nextProps.group && !!nextProps.group) {
			this.props.onSetGroup(nextProps.group)
		}
	}

	handleCoverImageChange = (e) => {
		try {
      this.props.onCoverImageChange(e.target.files[0])
    } catch (error) {
     // 
    }
	}

	handleSubmit = (e) => {
		e.preventDefault()
		if (this.props.onClose) this.props.onClose()
		this.props.onSubmit(this.context.router.history)
	}

	
	render() {
		const {
			group,
			error,
			titleValue,
			descriptionValue,
			coverImage,
			intl,
			onTitleChange,
			onDescriptionChange,
			onChangeGroupId,
			onChangeGroupTags,
			onChangeGroupCategory,
			onChangeGroupIsPrivate,
			onChangeGroupIsVisible,
			isSubmitting,
			onSubmit,
			idValue,
			tags,
			category,
			isPrivate,
			isVisible,
			groupId,
			categories,
			isAdmin,
		} = this.props

		if (!group && groupId) {
			return <ColumnIndicator type='loading' />
		} else if ((!group && error) || (groupId && !isAdmin)) {
			return <ColumnIndicator type='missing' />
		}

		const memberCount = group ? group.get('member_count') : 0
		const hasGroupSlug = group ? !!group.get('slug') : false
		let categoriesOptions = []
		if (categories) {
			for (let i = 0; i < categories.count(); i++) {
				const c = categories.get(i)
				categoriesOptions.push({
					title: c.get('text'),
					value: c.get('id'),
				})
			}
		}

		return (
			<Form onSubmit={onSubmit}>
				<Input
					id='group-title'
					title={intl.formatMessage(messages.title)}
					value={titleValue}
					onChange={onTitleChange}
					disabled={isSubmitting}
					placeholder={intl.formatMessage(messages.titlePlaceholder)}
				/>

				<Divider isInvisible />

				{
					memberCount >= 50 && !hasGroupSlug &&
					<React.Fragment>
						<Input
							id='group-id'
							title={intl.formatMessage(messages.idTitle)}
							value={idValue}
							onChange={onChangeGroupId}
							disabled={isSubmitting}
						/>
						<Text className={[_s.mt5, _s.pl15]} size='small' color='secondary'>
							{
								!!idValue &&
								<b>g/{idValue}&nbsp;–&nbsp;</b>
							}
							{intl.formatMessage(messages.idDescription)}
						</Text>

						<Divider isInvisible />
					</React.Fragment>
				}

				<Input
					id='group-tags'
					title={intl.formatMessage(messages.tagsTitle)}
					value={tags}
					onChange={onChangeGroupTags}
					disabled={isSubmitting}
				/>
				<Text className={[_s.mt5, _s.pl15]} size='small' color='secondary'>
					{intl.formatMessage(messages.tagsDescription)}
				</Text>

				<Divider isInvisible />			

				<div className={_s.default}>
					<Text className={[_s.pl15, _s.mb10].join(' ')} size='small' weight='medium' color='secondary'>
						{intl.formatMessage(messages.categoryTitle)}
					</Text>
					<Select
						value={category}
						onChange={onChangeGroupCategory}
						options={categoriesOptions}
					/>
					<Text className={[_s.mt5, _s.pl15].join(' ')} size='small' color='secondary'>
						{intl.formatMessage(messages.categoryDescription)}
					</Text>

					<Divider isInvisible />
				</div>

				<Textarea
					title={intl.formatMessage(messages.description)}
					value={descriptionValue}
					onChange={onDescriptionChange}
					placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
					disabled={isSubmitting}
				/>

				<Divider isInvisible />

				<FileInput
					disabled={isSubmitting}
					id='group-cover-photo'
					title={intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)}
					onChange={this.handleCoverImageChange}
					file={group ? group.get('cover_image_url') : undefined}
					width='340px'
					height='145px'
					isBordered
				/>
				<Text className={[_s.mt5, _s.pl15].join(' ')} size='small' color='secondary'>
					{intl.formatMessage(messages.coverImageDescription)}
				</Text>

				<Divider isInvisible />
				
				<Switch
					label={'Private'}
					id='group-isprivate'
					checked={isPrivate}
					onChange={onChangeGroupIsPrivate}
				/>
				<Text className={_s.mt5} size='small' color='secondary'>
					{intl.formatMessage(messages.isPrivateDescription)}
				</Text>

				<Divider isInvisible />
		
				<Switch
					label={'Visible'}
					id='group-isvisible'
					checked={isVisible}
					onChange={onChangeGroupIsVisible}
				/>
				<Text className={_s.mt5} size='small' color='secondary'>
					{intl.formatMessage(messages.isVisibleDescription)}
				</Text>
				
				<Divider isInvisible />
				
				<Button
					isDisabled={!titleValue || !descriptionValue && !isSubmitting}
					onClick={this.handleSubmit}
				>
					<Text color='inherit' align='center'>
						{intl.formatMessage(!!group ? messages.update : messages.create)}
					</Text>
				</Button>

			</Form>
		)
	}

}
