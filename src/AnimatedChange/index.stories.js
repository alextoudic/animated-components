import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Burst } from 'mo-js'

import StateContainer from '../utils/StateContainer'

import AnimatedChange from './index'
import Animation from '../Animation'
import CSSAnimation from '../CSSAnimation'

const animate = (done, el, isAppearing) => {
  const burst = new Burst({
    parent: el,
    left: '50%',
    top: '50%',
    radius: { 0: 30 },
    angle: 'rand(0, 360)',
    children: {
      shape: 'line',
      stroke: '#e6e6e6',
      fill: 'none',
      scale: 1,
      scaleX: { 1: 0 },
      easing: 'cubic.out',
      duration: 1000
    }
  })

  const bubbles = new Burst({
    parent: el,
    left: '50%',
    top: '50%',
    radius: 28,
    count: 3,
    timeline: { delay: 100 },
    children: {
      stroke: '#e6e6e6',
      fill: 'none',
      scale: 1,
      strokeWidth: { 8: 0 },
      radius: { 0: 'rand(6, 10)' },
      degreeShift: 'rand(-50, 50)',
      duration: 400,
      delay: 'rand(0, 250)',
    },
  })

  burst
    .generate()
    .replay()

  bubbles
    .generate()
    .replay()

  done()
}

storiesOf('AnimatedChange', module).add('microinterraction', () => (
  <StateContainer
    initialState={{ count: 0 }}
    modifiers={{
      increment: ({ count }) => () => ({ count: count + 1 }),
      decrement: ({ count }) => () => ({ count: count - 1 }),
    }}
  >
    {({ count }, { increment, decrement }) => (
      <div>
        <div style={{ display: 'block' }}>
          <button onClick={increment}>+1</button>
          <button onClick={decrement}>-1</button>
        </div>
        <AnimatedChange value={count}>
          {value => (
            <Animation onEntering={animate} exit={false}>
              <p
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: 20,
                }}
              >
                {value}
              </p>
            </Animation>
          )}
        </AnimatedChange>
      </div>
    )}
  </StateContainer>
))
.add('Animation', () => (
  <StateContainer
    initialState={{ count: 0 }}
    modifiers={{
      increment: ({ count }) => () => ({ count: count + 1 }),
      decrement: ({ count }) => () => ({ count: count - 1 }),
    }}
  >
    {({ count }, { increment, decrement }) => (
      <div>
        <AnimatedChange value={count}>
          {value => (
            <CSSAnimation classNames="fade">
              <p
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: 20,
                }}
              >
                {value}
              </p>
            </CSSAnimation>
          )}
        </AnimatedChange>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>
    )}
  </StateContainer>
))
.add('both animation', () => (
  <StateContainer
    initialState={{ count: 0 }}
    modifiers={{
      increment: ({ count }) => () => ({ count: count + 1 }),
      decrement: ({ count }) => () => ({ count: count - 1 }),
    }}
  >
    {({ count }, { increment, decrement }) => (
      <div>
        <span style={{
          position: 'relative',
          display: 'inline-block',
          padding: 20,
        }}>
          <AnimatedChange value={count} timing={AnimatedChange.BOTH}>
            {value => (
              <CSSAnimation classNames="translate">
                <p style={{ position: 'absolute' }} >
                  {value}
                </p>
              </CSSAnimation>
            )}
          </AnimatedChange>
        </span>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>
    )}
  </StateContainer>
))
