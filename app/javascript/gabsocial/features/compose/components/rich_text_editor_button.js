import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { changeRichTextEditorControlsVisibility } from '../../../actions/compose'
import { openModal } from '../../../actions/modal'
import { me } from '../../../initial_state'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
  title: { id: 'compose_form.rte.title', defaultMessage: 'Rich Text Editor' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'rte_controls_visible']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({

  onChangeRichTextEditorControlsVisibility() {
    dispatch(changeRichTextEditorControlsVisibility())
  },

  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class RichTextEditorButton extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
    isPro: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    onChangeRichTextEditorControlsVisibility: PropTypes.func.isRequired,
  }

  handleClick = (e) => {
    e.preventDefault()
    if (!this.props.isPro) {
      this.props.onOpenProUpgradeModal()
    } else {
      this.props.onChangeRichTextEditorControlsVisibility()
    }
  }

  render() {
    const { active, intl, small } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.title)}
        icon='rich-text'
        onClick={this.handleClick}
        small={small}
        active={active}
      />
    )
  }

}
