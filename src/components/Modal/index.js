//
//  Modal
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import './index.less';

const withModal = (Component) => (props) => {
  const handleClose = () => props.setIsOpen(false);

  const handleSelect = () => {
    handleClose();
    props.onSelect();
  };

  return (
    <>
      {props.isOpen
        && (
        <div className="modal-outbox">
          <div className={props.classname} style={props.style}>
            <Component {...props} onClose={handleClose} onSelect={handleSelect} />
          </div>
        </div>
        )}
    </>
  );
};

export default withModal;
