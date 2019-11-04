/**
 * Parvez M Robin
 * me@parvezmrobin.com
 * Date: Oct 27, 2019
 */

import React from 'react';
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import * as PropTypes from "prop-types";


export default function Notification(props) {
  return <div className="sticky-top">
    <Toast isOpen={!!props.message}>
      <ToastHeader icon="primary" toggle={props.toggle}>
        Jhijhi
      </ToastHeader>
      <ToastBody>
        {props.message}
      </ToastBody>
    </Toast>
  </div>;
}

Notification.propTypes = {
  message: PropTypes.any,
  toggle: PropTypes.func,
};
