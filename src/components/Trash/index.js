//
//  Trash
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//

import React from 'react'
import { compose } from 'recompose'
import Header from '../Home/header'
import Content from './content'

import { withAuthorization, withEmailVerification } from '../Session'

const Trash = () => (
  <div className='home'>
    <Header />
    <Content />
  </div>
)

const condition = authUser => !!authUser

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Trash)
