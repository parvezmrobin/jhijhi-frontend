/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React from 'react';
import * as PropTypes from 'prop-types';


function FormButton(props) {
  const offsetCol = props.offsetCol || 'offset-md-4 offset-lg-3';
  const btnClass = props.btnClass || 'outline-success';
  const type = props.type || 'button';

  return (
    <div className="form-group row">
      <div className={'col ' + offsetCol}>
        <input type={type} className={'btn btn-' + btnClass} value={props.text} onClick={props.onClick}/>
        {props.children}
      </div>
    </div>
  );
}

FormButton.propTypes = {
  offsetCol: PropTypes.string,
  btnClass: PropTypes.string,
};

export default FormButton;
