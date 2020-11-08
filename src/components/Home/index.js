import React, { useState } from 'react'
import { compose } from 'recompose'
import './index.less'

import { withAuthorization, withEmailVerification } from '../Session'
import Content from './content'
import Header from './header'

const Home = (props) => {
	const [notifications, setNotifications] = useState([])

	return (
		<div className='home'>
			<Header notifications={notifications} setNotifications={setNotifications} />
			<Content nextProps={props} notifications={notifications} setNotifications={setNotifications} />
		</div>
	)
}

const condition = authUser => !!authUser

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(Home)
