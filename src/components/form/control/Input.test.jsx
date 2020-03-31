/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Mar 31, 2020
 */

/* eslint-env jest */

import React from 'react';
import * as renderer from 'react-test-renderer';
import InputControl from './input';

test('InputControl is successfully rendered', () => {
  let val;
  const inputControl = renderer.create(
    <InputControl onChange={(e) => {
      val = e.target.value;
    }}
    />,
  );

  const tree = inputControl.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.onChange({ target: { value: 5 } });
  expect(val).toBe(5);
});
