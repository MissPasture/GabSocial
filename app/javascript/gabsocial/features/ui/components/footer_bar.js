import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import NotificationCounter from '../../../components/notification_counter';
import { me } from '../../../initial_state';

const links = [
  <NavLink key='pr1' className='footer-bar__link' to='/home' data-preview-title-id='column.home'>
    <i className='tabs-bar__link__icon home'/>
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </NavLink>,
  <NavLink key='pr2' className='footer-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
    <i className='tabs-bar__link__icon notifications'/>
    <NotificationCounter />
    <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
  </NavLink>,
  <NavLink key='pr3' className='footer-bar__link' to='/groups' data-preview-title-id='column.groups'>
    <i className='tabs-bar__link__icon groups'/>
    <FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />
  </NavLink>,
  <a key='pl4' className='footer-bar__link footer-bar__link--trends' href='https://trends.gab.com' data-preview-title-id='tabs_bar.trends'>
    <i className='tabs-bar__link__icon trends'/>
    <FormattedMessage id='tabs_bar.trends' defaultMessage='Trends' />
  </a>,
]

export default
@injectIntl
@withRouter
class FooterBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render () {
    const { intl: { formatMessage } } = this.props;

    if (!me) return null;

    return (
      <div className='footer-bar'>
        <div className='footer-bar__container'>
          {
            links.map((link) =>
              React.cloneElement(link, {
                key: link.props.to,
                'aria-label': formatMessage({
                  id: link.props['data-preview-title-id']
                })
              }))
          }
        </div>
      </div>
    );
  }
}