import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

const ButtonGroup = ({ desc }) => (
  <Button.Group size="small">{
    desc.map(item => (
      <Button
        type={item.type || 'primary'}
        icon={item.icon}
        onClick={item.onClick} />
    ))
  }</Button.Group>
)

ButtonGroup.propTypes = {
  desc: PropTypes.array.isRequired
}

export default ButtonGroup
