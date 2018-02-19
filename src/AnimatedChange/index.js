import React, { Component, cloneElement } from 'react'

import AnimatedGroup from '../AnimatedGroup'

const cache = []
const uniq = () => {
  const value = Math.floor(Math.random() * 999999)

  if (cache.includes(value)) return uniq()

  cache.push(value)

  return value
}

class AnimatedChange extends Component {
  static ENTER_EXIT = AnimatedGroup.ENTER_EXIT
  static EXIT_ENTER = AnimatedGroup.EXIT_ENTER
  static BOTH = AnimatedGroup.BOTH
 
  static defaultProps = {
    timing: AnimatedChange.EXIT_ENTER,
  }

  key = uniq()

  componentWillReceiveProps({ value }) {
    if (this.props.value !== value) {
      this.key = uniq()
    }
  }

  render() {
    const { key } = this
    const { value, children, timing } = this.props
    
    return (
      <AnimatedGroup timing={timing}>
        {cloneElement(children(value), { key })}
      </AnimatedGroup>
    )
  }
}

export default AnimatedChange
