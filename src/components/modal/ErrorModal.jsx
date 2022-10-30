/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 08, 2019
 */

import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';

function ErrorModal({ isOpen, close }) {
  return (
    <Modal contentClassName="bg-dark" isOpen={isOpen} toggle={close}>
      <ModalHeader className="text-warning" toggle={close}>
        Error While Performing The Action!
      </ModalHeader>
      <ModalBody>
        <blockquote className="blockquote">
          <p>
            Ignorance and error are necessary to life, like bread and water.
          </p>
          <footer className="blockquote-footer">
            French novelist <cite title="Source Title">Anatole France</cite>
          </footer>
        </blockquote>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={close}>
          Okay
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default ErrorModal;
