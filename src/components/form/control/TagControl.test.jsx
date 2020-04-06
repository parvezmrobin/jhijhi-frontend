/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Apr 04, 2020
 */

/* eslint-env jest */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import TagControl from './TagControl';

/** @type {HTMLElement} */
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

it('should renders TagControl', () => {
  act(() => {
    render(<TagControl
      value={[]}
      isValid
      options={['1', '2', '3']}
      onChange={() => {
      }}
    />, container);
  });
  expect(container.textContent).toBe('Insert tags for easy searching');
});

it('should render selected values', () => {
  const value = ['1', '2'];
  act(() => {
    render(<TagControl
      value={value}
      isValid
      options={['1', '2', '3']}
      onChange={() => {
      }}
    />, container);
  });

  expect(container.textContent).toBe(value.join(''));
});

it('should render valid state', () => {
  act(() => {
    render(<TagControl
      value={['1', '2']}
      isValid
      options={['1', '2', '3']}
      onChange={() => {
      }}
    />, container);
  });

  const tagControl = container.firstChild;
  expect(tagControl).toHaveClass('is-valid');
});

it('should render invalid state', () => {
  act(() => {
    render(<TagControl
      value={['1', '2']}
      isValid={false}
      options={['1', '2', '3']}
      onChange={() => {
      }}
    />, container);
  });

  const tagControl = container.firstChild;
  expect(tagControl).toHaveClass('is-invalid');
});
