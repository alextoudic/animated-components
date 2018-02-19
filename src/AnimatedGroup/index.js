import PropTypes from 'prop-types'
import React, {
  Component,
  Fragment,
  Children,
  cloneElement,
  isValidElement,
} from 'react'

// const ENTER = '__Animation_PHASE_ENTER__'
// const EXIT = '__Animation_PHASE_EXIT__'
// const BOTH = '__Animation_PHASE_BOTH__'
// const DONE = '__Animation_PHASE_DONE__'

export default class AnimatedGroup extends Component {
  static ENTER_EXIT = '__Animation_TIMING_ENTER_EXIT__'
  static EXIT_ENTER = '__Animation_TIMING_EXIT_ENTER__'
  static BOTH = '__Animation_TIMING_BOTH__'

  static ADD = '__Animation_STATE_ADD__'
  static MOUNTED = '__Animation_STATE_MOUNTED__'
  static REMOVE = '__Animation_STATE_REMOVE__'

  static defaultProps = {
    timing: AnimatedGroup.EXIT_ENTER,
  }

  static childContextTypes = {
    groupMounted: PropTypes.bool,
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  }

  state = {
    phase: 2,
  }

  entering = []
  exiting = []

  mounted = false

  mountedAnimation = []

  constructor(props, ...rest) {
    super(props, ...rest)

    const children = {}
    Children.forEach(props.children, child => {
      children[child.key] = {
        action: AnimatedGroup.ADD,
        child,
      }
    })

    this.state.children = children
  }

  getChildContext = () => ({
    groupMounted: this.mounted,
  })

  componentDidMount() {
    this.mounted = true
  }

  componentWillReceiveProps({ timing, children }) {
    const prev = this.state.children
    const next = {}
    Children.forEach(children, child => (next[child.key] = child))

    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(next)

    if (JSON.stringify(prevKeys) === JSON.stringify(nextKeys)) return

    const taggedChildren = [...new Set([...prevKeys, ...nextKeys])].reduce(
      (acc, key) => {
        let action
        let child
        if (prevKeys.includes(key)) {
          if (nextKeys.includes(key)) {
            const item = prev[key]
            action = AnimatedGroup.ADD
            child = item.child

            if (!this.mountedAnimation.includes(key) && !this.entering.includes(key)) {
              this.entering.push(key)
            }
            const exitingIndex = this.exiting.indexOf(key)
            if (exitingIndex !== -1) {
              this.exiting.splice(exitingIndex, 1)
            }
          } else {
            const item = prev[key]

            if (this.mountedAnimation.includes(key) && !this.exiting.includes(key)) {
              this.exiting.push(key)
            }

            action = AnimatedGroup.REMOVE
            child = item.child
          }
        } else {
          this.entering.push(key)

          action = AnimatedGroup.ADD
          child = next[key]
        }

        if (!isValidElement(child)) return acc

        return {
          ...acc,
          [key]: {
            action,
            child,
          },
        }
      },
      {}
    )

    let phase
    if (timing === AnimatedGroup.EXIT_ENTER) {
      if (!this.exiting.length) {
        if (!this.entering.length) {
          phase = 2
        } else {
          phase = 1
        }
      } else {
        phase = 0
      }
    } else if (timing === AnimatedGroup.ENTER_EXIT) {
      if (!this.entering.length) {
        if (!this.exiting.length) {
          phase = 2
        } else {
          phase = 1
        }
      } else {
        phase = 0
      }
    } else {
      if (!this.entering.length && !this.exiting.length) {
        phase = 2
      } else {
        phase = 0
      }
    }

    this.setState({
      phase,
      children: taggedChildren,
    })
  }

  handleEntered = key => {
    this.mountedAnimation.push(key)

    const index = this.entering.indexOf(key)
    if (index !== -1) {
      this.entering.splice(index, 1)
    }

    if (this.entering.length === 0) {
      this.setState(({ phase }) => ({ phase: phase + 1 }))
    }
  }

  handleExited = key => {
    const mountedIndex = this.mountedAnimation.indexOf(key)
    if (mountedIndex !== -1) {
      this.mountedAnimation.splice(mountedIndex, 1)
    }
    const exitingIndex = this.exiting.indexOf(key)
    if (exitingIndex !== -1) {
      this.exiting.splice(exitingIndex, 1)
    }

    this.setState(({ children }) => {
      const nextChildren = { ...children }

      delete nextChildren[key]

      return { children: nextChildren }
    })

    if (this.exiting.length === 0) {
      this.setState(({ phase }) => ({ phase: phase + 1 }))
    }
  }

  render() {
    const { timing } = this.props
    const { phase, children } = this.state

    const isExiting =
      (this.mounted &&
        (timing === AnimatedGroup.ENTER_EXIT && phase === 1)) ||
      (timing === AnimatedGroup.EXIT_ENTER && phase === 0)

    return (
      <Fragment>
        {Object.values(children).map(({ action, child }) =>
          cloneElement(child, {
            id: child.key,
            visible: action !== AnimatedGroup.REMOVE && !isExiting,
            onEntered: (...args) => {
              this.handleEntered(child.key)
              if (child.onEntered) {
                child.onEntered(...args)
              }
            },
            onExited: (...args) => {
              this.handleExited(child.key)
              if (child.onExited) {
                child.onExited(...args)
              }
            }
          })
        )}
      </Fragment>
    )
  }
}
