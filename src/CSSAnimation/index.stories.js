import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import StateContainer from '../utils/StateContainer'

import './styles.css'
import CSSAnimation from './index'

storiesOf('CSSAnimation', module)
  .add('fade', () => (
    <StateContainer
      initialState={{ visible: true }}
      modifiers={{
        toggleVisibility: ({ visible }) => () => ({ visible: !visible })
      }}
    >
      {({ visible }, { toggleVisibility }) => (
        <div>
          <CSSAnimation appear visible={visible} classNames="fade">
            <p>I'm a fade animation</p>
          </CSSAnimation>
          <button onClick={toggleVisibility}>toggle</button>
        </div>
      )}
    </StateContainer>
  ))