import BackButton from './back_button'
import Heading from './heading'

export default class ProfileNavigationBar extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { title } = this.props

    return (
      <div className={[_s.default, _s.z4, _s.height53PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.height53PX, _s.bgNavigation, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>

            <BackButton
              className={[_s.height53PX, _s.pl10, _s.pr10].join(' ')}
              iconSize='18px'
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />

            <div className={[_s.default, _s.height53PX, _s.justifyContentCenter, _s.mrAuto].join(' ')}>
              <Heading size='h1'>
                <span className={[_s.textOverflowEllipsis, _s.colorNavigation].join(' ')}>
                  {title}
                </span>
              </Heading>
            </div>

          </div>

        </div>
      </div>
    )
  }

}