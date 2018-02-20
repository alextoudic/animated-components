import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import AnimatedGroup from '../AnimatedGroup'

const noop = () => {}
const noopCb = done => done()

export default class Animation extends Component {
  static IDLE = '__Animation_IDLE__'
  static ENTER = '__Animation_ENTER__'
  static ENTERING = '__Animation_ENTERING__'
  static ENTERED = '__Animation_ENTERED__'
  static EXIT = '__Animation_EXIT__'
  static EXITING = '__Animation_EXITING__'
  static EXITED = '__Animation_EXITED__'
  
  static defaultProps = {
    delay: 0,
    timeout: null,
    appear: false,
    enter: true,
    exit: true,
    mountOnEnter: true,
    unmountOnExit: true,
    visible: true,
    onEnter: noop,
    onEntering: noopCb,
    onEntered: noop,
    onExit: noop,
    onExiting: noopCb,
    onExited: noop,
  }

  static childContextTypes = {
    visibleInParent: PropTypes.bool,
    useBridge: PropTypes.func,
  }

  static contextTypes = {
    ...AnimatedGroup.childContextTypes,
    ...Animation.childContextTypes,
  }

  getChildContext = () => ({
    visibleInParent: this.state.childrenVisible,
  })

  state = {
    status: Animation.IDLE,
    childrenVisible: false,
  }

  componentDidMount() {
    const { mountOnEnter, appear, visible, enter } = this.props
    const { visibleInParent } = this.context

    if (visible && (visibleInParent === undefined || visibleInParent)) {
      this.setState({ childrenVisible: true })
      this.enter(!this.context.groupMounted)
    }
  }

  componentWillReceiveProps({ visible }, { visibleInParent }) {
    if (this.props.visible !== visible) {
      if (visibleInParent === undefined || visibleInParent) {
        this.setState({ childrenVisible: visible })
        if (visible) {
          this.enter()
        } else {
          this.exit()
        }
      }
    } else if (this.context.visibleInParent !== visibleInParent && visible) {
      if (visibleInParent) {
        this.enter(true)
      } else {
        this.exit(true)
      }
    }
  }

  enter(isAppearing) {
    const onEntered = () => {
      this.setState({
        status: Animation.ENTERED,
      }, () => this.props.onEntered(findDOMNode(this), isAppearing))
    }

    if (!(isAppearing ? this.props.appear : this.props.enter)) {
      onEntered()
    } else {
      this.setState({
        status: Animation.ENTER,
      }, () => {
        const delay = this.props.delay && typeof this.props.delay === 'object' ? this.props.delay.enter : this.props.delay || 0

        this.props.onEnter(findDOMNode(this), isAppearing)
  
        setTimeout(() => {
          this.setState({
            status: Animation.ENTERING,
          }, () => {
            const timeout = this.props.timeout && typeof this.props.timeout === 'object' ? this.props.timeout.enter : this.props.timeout || 0
            const useTimeout = timeout !== null
    
            if (useTimeout) {
              setTimeout(onEntered, timeout)
            }
    
            this.props.onEntering(() => {
              if (!useTimeout) onEntered()
            }, findDOMNode(this), isAppearing)
          })
        }, delay)
      })
    }
  }

  exit(isDisappearing) {
    const onExited = () => {
      this.setState({
        status: Animation.EXITED,
      }, () => this.props.onExited(findDOMNode(this), isDisappearing))
    }

    if (!this.props.exit) {
      onExited()
    } else {
      this.setState({
        status: Animation.EXIT,
      }, () => {
        const delay = this.props.delay && typeof this.props.delay === 'object' ? this.props.delay.exit : this.props.delay || 0
  
        this.props.onExit(findDOMNode(this), isDisappearing)
  
        setTimeout(() => {
          this.setState({
            status: Animation.EXITING,
          }, () => {
            const timeout = this.props.timeout && typeof this.props.timeout === 'object' ? this.props.timeout.exit : this.props.timeout || 0
            const useTimeout = timeout !== null
    
            if (useTimeout) {
              setTimeout(onExited, timeout)
            }
    
            this.props.onExiting(() => {
              if (!useTimeout) onExited()
            }, findDOMNode(this), isDisappearing)
          })
        }, delay)
      })
    }
  }

  render() {
    const { status } = this.state
    const { children, mountOnEnter, unmountOnExit } = this.props

    if (
      (mountOnEnter && status === Animation.IDLE)
      || (unmountOnExit && status === Animation.EXITED)
    ) {
      return null
    }

    return typeof children === 'function' ? children(status) : children
  }
}
