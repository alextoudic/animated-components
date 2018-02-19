import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import StateContainer from '../utils/StateContainer'
import CSSAnimation from '../CSSAnimation'

import Animation from './index'

storiesOf('Animation', module)
  .add('basic', () => (
    <StateContainer
      initialState={{ visible: true }}
      modifiers={{
        toggleVisibility: ({ visible }) => () => ({ visible: !visible })
      }}
    >
      {({ visible }, { toggleVisibility }) => (
        <div>
          <Animation
            appear
            timeout={0}
            visible={visible}
            onEnter={action('enter')}
            onEntering={action('entering')}
            onEntered={action('entered')}
            onExit={action('exit')}
            onExiting={action('exiting')}
            onExited={action('exited')}
          >
            <p>Hello!</p>
          </Animation>
          <button onClick={toggleVisibility}>toggle</button>
        </div>
      )}
    </StateContainer>
  ))
  .add('without unmounting', () => (
    <StateContainer
      initialState={{ visible: true }}
      modifiers={{
        toggleVisibility: ({ visible }) => () => ({ visible: !visible })
      }}
    >
      {({ visible }, { toggleVisibility }) => (
        <div>
          <Animation
            appear
            unmountOnExit={false}
            timeout={0}
            visible={visible}
            onEnter={action('enter')}
            onEntering={action('entering')}
            onEntered={action('entered')}
            onExit={action('exit')}
            onExiting={action('exiting')}
            onExited={action('exited')}
          >
            <p>Hello!</p>
          </Animation>
          <button onClick={toggleVisibility}>toggle</button>
        </div>
      )}
    </StateContainer>
  ))
  .add('nested animations', () => (
    <StateContainer
      initialState={{ visible: true }}
      modifiers={{
        toggleVisibility: ({ visible }) => () => ({ visible: !visible })
      }}
    >
      {({ visible }, { toggleVisibility }) => (
        <div>
          <CSSAnimation
            appear
            classNames="fade"
            timeout={800}
            delay={{ enter: 0, leave: 400 }}
            visible={visible}
            onEnter={action('enter')}
            onEntering={action('entering')}
            onEntered={action('entered')}
            onExit={action('exit')}
            onExiting={action('exiting')}
            onExited={action('exited')}
          >
            <p>Hello!</p>
            <CSSAnimation
              appear
              disappear
              timeout={800}
              classNames="translate-down"
              onEnter={action('nested enter')}
              onEntering={action('nested entering')}
              onEntered={action('nested entered')}
              onExit={action('nested exit')}
              onExiting={action('nested exiting')}
              onExited={action('nested exited')}
            >
              <p>I'm nested</p>
            </CSSAnimation>
          </CSSAnimation>
          <button onClick={toggleVisibility}>toggle</button>
        </div>
      )}
    </StateContainer>
  ))
