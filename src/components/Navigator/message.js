//
//  Message
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import withModal from '../Modal';

const Message = ({ text, onSelect }) => (
  <form className="modal-form-navigator-editable">
    <p>{`The name '${text}' is already taken or is a reserved keyword. Formula names are reserved.`}</p>
    <button className="modal-button" onClick={onSelect}>Ok</button>
  </form>
);

export default withModal(Message);
