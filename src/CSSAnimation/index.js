import React, { Component } from 'react'

import Animation from '../Animation'

const noop = () => {}

export default class extends Component {
  static defaultProps = {
    onEnter: noop,
    onEntering: noop,
    onEntered: noop,
    onExit: noop,
    onExiting: noop,
    onExited: noop,
  }

  handleEnter = (el, isAppearing = false) => {
    const { classNames, onEnter } = this.props

    el.removeEventListener('transitionend', this.lastCb, {
      capture: false,
      once: true,
    })

    const className = isAppearing ? (classNames.appear || `${classNames}-appear`) : (classNames.enter || `${classNames}-enter`)
    el.classList.add(className)

    onEnter(el, isAppearing)
  }

  handleEntering = (done, el, isAppearing = false) => {
    const { classNames, onEntering } = this.props

    this.lastCb = done
    el.addEventListener('transitionend', done, {
      capture: false,
      once: true,
    })

    const className = isAppearing ? (classNames.appearActive || `${classNames}-appear-active`) : (classNames.enterActive || `${classNames}-enter-active`)
    el.classList.add(className)

    onEntering(el, isAppearing)
  }

  handleEntered = (el, isAppearing = false) => {
    const { classNames, onEntered } = this.props

    const className = isAppearing ? (classNames.appear || `${classNames}-appear`) : (classNames.enter || `${classNames}-enter`)
    const classNameActive = isAppearing ? (classNames.appearActive || `${classNames}-appear-active`) : (classNames.enterActive || `${classNames}-enter-active`)
    el.classList.remove(className, classNameActive)

    onEntered(el, isAppearing)
  }

  handleExit = (el, isDisappearing = false) => {
    const { classNames, onExit } = this.props

    el.removeEventListener('transitionend', this.lastCb, {
      capture: false,
      once: true,
    })

    const className = isDisappearing ? (classNames.disappear || `${classNames}-disappear`) : (classNames.exit || `${classNames}-exit`)
    el.classList.add(className)

    onExit(el, isDisappearing)
  }

  handleExiting = (done, el, isDisappearing = false) => {
    const { classNames, onExiting } = this.props

    this.lastCb = done
    el.addEventListener('transitionend', done, {
      capture: false,
      once: true,
    })

    const className = isDisappearing ? (classNames.disappearActive || `${classNames}-disappear-active`) : (classNames.exitActive || `${classNames}-exit-active`)
    el.classList.add(className)

    onExiting(el, isDisappearing)
  }

  handleExited = (el, isDisappearing = false) => {
    const { classNames, onExited } = this.props

    if (el) {
      const className = isDisappearing ? (classNames.disappear || `${classNames}-disappear`) : (classNames.exit || `${classNames}-exit`)
      const classNameActive = isDisappearing ? (classNames.disappearActive || `${classNames}-disappear-active`) : (classNames.exitActive || `${classNames}-exit-active`)
      el.classList.remove(className, classNameActive)
    }

    onExited(el, isDisappearing)
  }

  render() {
    const { props } = this

    return (
      <Animation
        {...props}
        delay={{ exit: props.delay ? Math.max(props.delay.enter || props.delay, 100) : 100 }} // needed to Animation entering
        onEnter={this.handleEnter}
        onEntering={this.handleEntering}
        onEntered={this.handleEntered}
        onExit={this.handleExit}
        onExiting={this.handleExiting}
        onExited={this.handleExited}
      />
    )
  }
}
