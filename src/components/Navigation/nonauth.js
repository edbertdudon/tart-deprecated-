import React from 'react'
import { Link } from 'react-router-dom'

import * as ROUTES from '../../constants/routes'

const NonAuth = () => (
  <div className='navigation-header'>
    <div className='navigation-header-container'>
        <div className='navigation-header-left'>
					<Link to={ROUTES.HOME}>Tart</Link>
        </div>
    </div>
  </div>
)

export default NonAuth
