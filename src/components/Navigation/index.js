import React, { useEffect } from 'react';
import { useRouteMatch, withRouter, useLocation, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdilTable } from '@mdi/light-js'
import { mdiDatabase, mdiFile, mdiTable, mdiDelete, mdiClockTimeNine } from '@mdi/js'
import './index.less'

import NonAuth from './nonauth'
import Home from './home'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const Worksheet = () => (
	<div className='navigation-homebutton'>
		<Link to={ROUTES.HOME}>
			<div>Tart</div>
		</Link>
	</div>
)

const Auth = ({ props }) => {
	const path = useRouteMatch(ROUTES.WORKSHEET)
	const location = useLocation()

	useEffect(() => {
		if (props.authUser !== null) {
			props.firebase.user(props.authUser.uid).get().then(doc => {
				if (doc.exists) {
					props.onSetColor(doc.data().color, props.authUser.uid)
				}
			})
		}
	}, [props.authUser])

	return (
		(path !== null && path.url !== '/')
			? <Worksheet />
			: <Home color={props.authUser === null ? '#fff' : props.color[props.authUser.uid]} pathname={location.pathname} />
	)
}

const Navigation = (props) => (
	<div>
		{
			{
				[ROUTES.SIGN_IN]: <NonAuth />,
				[ROUTES.ACCOUNT]: <NonAuth />,
				[ROUTES.VERIFICATION]: <NonAuth />,
				[ROUTES.SIGN_UP]: <NonAuth />,
				[ROUTES.PASSWORD_FORGET]: <NonAuth />,
				[ROUTES.WORKSHEET]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.HOME]: <Auth props={props}/>,
				[ROUTES.SETTINGS]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.CONNECTIONS]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.INPUTS]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.TRASH]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.SEARCH]: <Auth authUser={props.authUser} props={props}/>,
				[ROUTES.JOBS]: <Auth authUser={props.authUser} props={props}/>,
			}[props.location.pathname]
		}
	</div>
)
// [ROUTES.ADMIN_DETAILS]: <Auth authUser={props.authUser} props={props}/>,
// [ROUTES.ADMIN]: <Auth authUser={props.authUser} props={props}/>,

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
})

const mapDispatchToProps = dispatch => ({
	onSetColor: (color, uid) => dispatch({ type: 'COLOR_SET', color, uid})
})

export default compose(
	withFirebase,
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(Navigation)
