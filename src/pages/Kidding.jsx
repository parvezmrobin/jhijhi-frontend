import React from 'react';
import CenterContent from '../components/layouts/CenterContent';

export default function Kidding() {
  return (
    <CenterContent>
      <h2 className="text-center mt-10 mt-lg-0">
        <span className="d-inline-block">
          Managing account with only <code>username</code> and{' '}
          <code>password</code>?
        </span>
        <span className="d-none d-md-inline">&nbsp;</span>
        <span className="d-inline-block">Are you kidding yourself?</span>
      </h2>
    </CenterContent>
  );
}
