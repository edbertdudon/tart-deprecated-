//
//  Message
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import withModal from '../Modal';

const RefreshFail = () => (
  <form className="modal-form-navigator-editable">
    <p>Failed to connect to data.</p>
    <button className="modal-button">Ok</button>
  </form>
);

export default withModal(RefreshFail);
