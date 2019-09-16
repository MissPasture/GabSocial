import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { me } from '../../initial_state';
import NotificationsCounter from '../notification_counter';
import SearchContainer from 'gabsocial/features/compose/containers/search_container';
import Avatar from '../avatar';
import ActionBar from 'gabsocial/features/compose/components/action_bar';
import { openModal } from '../../actions/modal';

import './tabs_bar.scss';

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose() {
    dispatch(openModal('COMPOSE'));
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@withRouter
class TabsBar extends ImmutablePureComponent {

  static propTypes = {
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { account, onOpenCompose } = this.props;

    if (!account) {
      return (
        <nav className='tabs-bar'>
          <div className='tabs-bar__container'>
            <div className='tabs-bar__split tabs-bar__split--left'>
              <a className='tabs-bar-item--logo' href='/#' data-preview-title-id='column.home' style={{ padding: '0' }}>
                <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
              </a>
              <a className='tabs-bar-item home' href='/home' data-preview-title-id='column.home'  >
                <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
              </a>
              <NavLink className='tabs-bar-item optional' to='/search' data-preview-title-id='tabs_bar.search' >
                <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
              </NavLink>
            </div>
            <div className='tabs-bar__split tabs-bar__split--right'>
              <div className='tabs-bar__search-container'>
                <SearchContainer openInRoute />
              </div>
              <div className='flex'>
                <a className='tabs-bar__button button' href='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </a>
                <a className='tabs-bar__button button button-alternative-2' href='/auth/sign_up'>
                  <FormattedMessage id='account.register' defaultMessage='Sign up' />
                </a>
              </div>
            </div>
          </div>
        </nav>
      );
    }

    return (
      <nav className='tabs-bar'>
        <div className='tabs-bar__container'>
          <div className='tabs-bar__split tabs-bar__split--left'>
            <NavLink className='tabs-bar-item--logo' to='/home#' data-preview-title-id='column.home' style={{ padding: '0' }}>
              <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
            </NavLink>
            <NavLink className='tabs-bar-item home' to='/home' data-preview-title-id='column.home'  >
              <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
            </NavLink>
            <NavLink className='tabs-bar-item notifications' to='/notifications' data-preview-title-id='column.notifications' >
              <NotificationsCounter />
              <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
            </NavLink>
            <NavLink className='tabs-bar-item groups' to='/groups' data-preview-title-id='column.groups' >
              <FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />
            </NavLink>
            <NavLink className='tabs-bar-item optional' to='/search' data-preview-title-id='tabs_bar.search' >
              <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
            </NavLink>
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            <div className='tabs-bar__search-container'>
              <SearchContainer openInRoute />
            </div>
            <div className='flex'>
              <div className='tabs-bar__profile'>
                <Avatar account={account} />
                <ActionBar account={account} size={34} />
              </div>
              <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label='Gab'>Gab</button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}