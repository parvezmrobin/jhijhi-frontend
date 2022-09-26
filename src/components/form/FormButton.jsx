/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */

import React from 'react';
import * as PropTypes from 'prop-types';

function FormButton({ offsetCol, btnClass, type, onClick, children }) {
  const _offsetCol = offsetCol || 'offset-md-4 offset-lg-3';
  const _btnClass = btnClass || 'outline-success';
  const _type = type || 'button';

  return (
    <div className="form-group row">
      <div className={`col ${_offsetCol}`}>
        <input
          type={type}
          className={`btn btn-${_btnClass}`}
          value={_type}
          onClick={onClick}
        />
        {children}
      </div>
    </div>
  );
}

FormButton.propTypes = {
  offsetCol: PropTypes.string,
  btnClass: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default FormButton;
