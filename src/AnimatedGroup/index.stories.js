import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'

import StateContainer from '../utils/StateContainer'

import AnimatedGroup from './index'
import CSSAnimation from '../CSSAnimation'

const uniq = prefix => `${prefix}-${~~(Math.random() * 99999)}`

storiesOf('AnimatedGroup', module).add('Animation', () => (
  <StateContainer
    initialState={{
      entry: '',
      list: [
        {
          _id: 'foo-0',
          value: 'foo',
        },
        {
          _id: 'bar-0',
          value: 'bar',
        },
        {
          _id: 'baz-0',
          value: 'baz',
        },
      ],
    }}
    modifiers={{
      add: ({ list }) => item => ({
        list: [
          ...list,
          {
            _id: uniq(item),
            value: item,
          },
        ],
        // ].slice(-3),
      }),
      remove: ({ list }) => id => {
        const index = list.findIndex(({ _id }) => _id === id)
        if (index === -1) return

        return {
          list: [
            ...list.slice(0, index),
            ...list.slice(index + 1),
          ],
        }
      },
      update: () => ({ target: { value } }) => ({ entry: value }),
      clear: () => () => ({ entry: '' }),
    }}
  >
    {({ entry, list }, { update, add, remove, clear }) => (
      <div>
        <input
          type="text"
          value={entry}
          onChange={update}
        />
        <button onClick={() => {
          if (!entry) return

          add(entry)
          clear()
        }}>
          add
        </button>
        <ul>
          <AnimatedGroup timing={AnimatedGroup.BOTH}>
            {list.map((item, i) => (
              <CSSAnimation classNames='fade' key={item._id}>
                <li>
                  {item.value}
                  <button onClick={() => remove(item._id)}>
                    X
                  </button>
                </li>
              </CSSAnimation>
            ))}
          </AnimatedGroup>
        </ul>
      </div>
    )}
  </StateContainer>
))
