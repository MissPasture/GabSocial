import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openPopover } from '../../actions/popover'
import { changeSetting, saveSettings } from '../../actions/settings'
import { openModal } from '../../actions/modal'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import {
  THEMES,
  DEFAULT_THEME,
  POPOVER_NAV_SETTINGS,
  MODAL_DECK_COLUMN_ADD,
} from '../../constants'
import Avatar from '../avatar'
import BackButton from '../back_button'
import Button from '../button'
import Icon from '../icon'
import NavigationBarButton from '../navigation_bar_button'
import Divider from '../divider'

class DeckSidebar extends ImmutablePureComponent {

  handleOnClickLightBulb = () => {
    let index = THEMES.findIndex((t) => t === this.props.theme)
    const nextIndex = (index === THEMES.length -1) ? 0 : index += 1
    const newTheme = THEMES[nextIndex]
    this.props.onChange('theme', newTheme)
  }

  handleOnOpenNavSettingsPopover = () => {
    this.props.onOpenNavSettingsPopover(this.avatarNode)
  }

  handleOnOpenNewColumnModel = () => {
    this.props.onOpenNewColumnModal()
  }

  setAvatarNode = (c) => {
    this.avatarNode = c
  }

  render() {
    const { account, logoDisabled } = this.props

    return (
      <div className={[_s.d, _s.z4, _s.w76PX, _s.w100PC].join(' ')}>

        <div className={[_s.d, _s.w76PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.bottom0, _s.left0, _s.borderRight1PX, _s.borderColorSecondary, _s.posFixed].join(' ')}>

          <div className={[_s.d, _s.flexRow, _s.w76PX, _s.h100PC].join(' ')}>

            <div className={[_s.d].join(' ')}>

              <h1 className={[_s.d].join(' ')}>
                <Button
                  to='/'
                  isText
                  title='Gab'
                  aria-label='Gab'
                  color='none'
                  backgroundColor='none'
                  className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.cursorPointer, _s.px10, _s.mr5].join(' ')}
                >
                  <Icon id='logo' className={_s.fillNavigationBrand} minimizeLogo={logoDisabled} />
                </Button>
              </h1>

              <div className={[_s.d, _s.px10].join(' ')}>

                <NavigationBarButton icon='pencil' />
                
                <NavigationBarButton icon='search' />

                <Divider isSmall />

                <Divider isSmall />

                <NavigationBarButton title='&nbsp;' icon='add' onClick={this.handleOnOpenNewColumnModel} />
              </div>

              <div className={[_s.d, _s.mtAuto, _s.aiCenter].join(' ')}>

                <Divider isSmall />

                <NavigationBarButton attrTitle='Dark/Muted/Light/White Mode' icon='light-bulb' onClick={this.handleOnClickLightBulb} />

                <button
                  ref={this.setAvatarNode}
                  title={account.get('display_name')}
                  onClick={this.handleOnOpenNavSettingsPopover}
                  className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter].join(' ')}
                >
                  <Avatar account={account} size={34} noHover />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
  logoDisabled: state.getIn(['settings', 'displayOptions', 'logoDisabled'], false),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenNavSettingsPopover(targetRef) {
    dispatch(openPopover(POPOVER_NAV_SETTINGS, {
      targetRef,
      position: 'right-start',
    }))
  },
  onOpenNewColumnModal() {
    dispatch(openModal(MODAL_DECK_COLUMN_ADD))
  },
  onChange(key, value) {
    dispatch(changeSetting(['displayOptions', key], value))
    dispatch(saveSettings())
  },
})

DeckSidebar.propTypes = {
  account: ImmutablePropTypes.map,
  onOpenNavSettingsPopover: PropTypes.func.isRequired,
  onOpenNewColumnModal: PropTypes.func.isRequired,
  theme: PropTypes.string,
  logoDisabled: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckSidebar)