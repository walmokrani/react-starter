import React from 'react'
import { shallow } from 'enzyme'
import App from './App'

/* eslint-env jest */

it('Render without props without crashing', () => {
  const wrapper = shallow(<App />)
  expect(wrapper).toHaveLength(1)
})
