import React from 'react'
import PropTypes from 'prop-types'
import Text from './text'

export default class DotTextSeperator extends React.PureComponent {

  render() {
    return (
      <Text size='small' color='secondary' className={_s.ml5}>·</Text>
    )
  }

}
