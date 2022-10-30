/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Mar 31, 2020
 */

/* eslint-env jest */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import InputControl from './InputControl';
import '@testing-library/jest-dom';

/**
 * @type {HTMLElement}
 */
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('should renders InputControl', () => {
  act(() => {
    render(
      <InputControl value={['2']} isValid onChange={() => {}} />,
      container
    );
  });

  const input = container.querySelector('input');
  expect(input.value).toBe('2');
  expect(input).toHaveClass('is-valid');
});

it('should handle onChange properly', () => {
  let val = '2';
  let isValid = true;
  act(() => {
    render(
      <InputControl
        value={[val]}
        isValid={isValid}
        onChange={(e) => {
          val = e.target.value;
          isValid = e.target.value < 3;
        }}
      />,
      container
    );
  });

  const input = container.querySelector('input');
  input.value = '5';
  expect(input).toHaveValue('5');
  expect(input).toHaveClass('is-invalid');
  expect(input).not.toHaveClass('is-valid');
});
