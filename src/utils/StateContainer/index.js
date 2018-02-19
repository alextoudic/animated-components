import { Component } from 'react'

export default class extends Component {
  constructor(props) {
    super(props)

    const { initialState } = props

    this.state = { ...initialState }
  }

  render() {
    const { children, modifiers } = this.props

    const boundModifiers = Object.keys(modifiers).reduce((acc, modifier) => ({
      ...acc,
      [modifier]: (...args) =>
        this.setState(modifiers[modifier](this.state)(...args))
    }), {})

    return children(this.state, boundModifiers)
  }
}