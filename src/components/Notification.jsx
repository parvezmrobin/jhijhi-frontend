/**
 * Parvez M Robin
 * me@parvezmrobin.com
 * Date: Oct 27, 2019
 */

import React from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import * as PropTypes from 'prop-types';

export default function Notification({ message, toggle }) {
  return (
    <div className="sticky-top">
      <Toast isOpen={!!message}>
        <ToastHeader icon="primary" toggle={toggle} className="text-primary">
          Jhijhi
        </ToastHeader>
        <ToastBody className="bg-dark">{message}</ToastBody>
      </Toast>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  toggle: PropTypes.func,
};
