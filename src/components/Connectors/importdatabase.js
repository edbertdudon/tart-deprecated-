import React, { useState, useRef } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js'
import './index.less'

import { serverConnect } from './serverConnect'
import { withFirebase } from '../Firebase'

const ImportDatabase = ({ firebase, authUser, color, databaseType, onClose }) => {
	const [loading, setLoading] = useState(false)
	const [host, setHost] = useState('')
	const [port, setPort] = useState('')
	const [sid, setSid] = useState('')
	const [url, setUrl] = useState('')
	const [user, setUser] = useState('')
	const [password, setPassword] = useState('')
	const [ssl, setSSL] = useState(false)
	const [caFile, setCaFile] = useState('')
	const [keyFile, setKeyFile] = useState('')
	const [certFile, setCertFile] = useState('')
  const [error, setError] = useState(null)
	const ca = useRef(null)
	const key = useRef(null)
	const cert = useRef(null)

	const handleClose = () => {
		// setHost('')
		// setPort('')
		// setSid('')
		// setUser('')
		// setPassword('')
		// setUrl('')
		setError(null)
		setLoading(false)
		onClose()
	}

	const handleHost = e => setHost(e.target.value)
	const handlePort = e => setPort(e.target.value)
	const handleSid = event => setSid(event.target.value)
	const handleUser = e => setUser(e.target.value)
	const handlePassword = e => setPassword(e.target.value)
	const handleUrl = e => setUrl(e.target.value)

	const handleClickCA = () => ca.current.click()
	const handleClickKey = () => key.current.click()
	const handleClickCert = () => cert.current.click()

	const handleInputCA = e => setCaFile(e.target.files[0])
	const handleInputKey = e => setKeyFile(e.target.files[0])
	const handleInputCert = e => setCertFile(e.target.files[0])

	const handleConnect = () => {
		setLoading(true)
		if (databaseType === "OracleDB") {
			const data = {
				host: host,
				user: user,
				password: password,
				port: port,
				sid: sid,
				url: url,
				connector: databaseType,
				uid: authUser.uid
			}
		} else {
			const data = {
				host: host,
				user: user,
				password: password,
				port: port,
				url: url,
				connector: databaseType,
				uid: authUser.uid,
			}
		}

		serverConnect(databaseType, data, firebase).then(res => {
			setLoading(false)
			if (res.status === 'CONNECTED') {
				handleClose()
				//upload files
			} else if (res.status === 'ERROR') {
				setLoading(false)
				setError('Unable to connect')
			}
		})
	}

	const isInvalid = databaseType === "OracleDB"
		? (host === '' || port === '' || sid === '' || user === '' || password === '') && url === ''
		:	(host === '' || port === '' || user === '' || password === '') && url === ''

	return (
		<form className='modal-form'>
			<div className='importdatabase-inputs'>
				<div className='importdatabase-inputs-host'>
					<input
						placeholder='localhost'
						type="text"
						name="host"
						onChange={handleHost}
						autoFocus={true}
						disabled={url === '' ? false : true}
					/>
				</div>
				<div className='importdatabase-inputs-port'>
					<input
						placeholder='1433'
						type="text"
						name="port"
						onChange={handlePort}
						disabled={url === '' ? false : true}
					/>
				</div>
				{databaseType === "OracleDB" && <>
					<br/>
					<div className='importdatabase-inputs-login'>
						<input
							placeholder='Oracle system identifier (SID)'
							type="text"
							name="sid"
							onChange={handleSid}
						/>
					</div>
				</>}
				<br/>
		    <div className='importdatabase-inputs-login'>
					<input
						placeholder='username'
						type="text"
						name="user"
						onChange={handleUser}
						disabled={url === '' ? false : true}
					/>
		    </div>
        <br/>
        <div className='importdatabase-inputs-login'>
					<input
						placeholder='password'
						type="password"
						name="password"
						onChange={handlePassword}
						disabled={url === '' ? false : true}
					/>
        </div>
				<p>or</p>
				<div className='importdatabase-inputs-login'>
					<input
						placeholder='url'
						type="text"
						name="url"
						onChange={handleUrl}
						disabled={host === '' && port === '' && user === '' && password === '' ? false : true}
					/>
				</div>
				{ssl &&
					<div>
						<div className='importdatabase-inputs-login'>
							<input
								value={caFile.length < 1 ? "Certificate authority" : caFile.name}
								type="button"
								onClick={handleClickCA}
								className='importdatabase-inputs-button'
							/>
							<input type="file" onChange={handleInputCA} accept=".pem" ref={ca}/>
						</div>
						<br/>
						<div className='importdatabase-inputs-login'>
							<input
								value={keyFile.length < 1 ? "Client key" : keyFile.name}
								type="button"
								onClick={handleClickKey}
								className='importdatabase-inputs-button'
							/>
							<input type="file" onChange={handleInputKey} accept=".pem" ref={key}/>
						</div>
						<div className='importdatabase-inputs-login'>
							<input
								value={certFile.length < 1 ? "Client certificate" : certFile.name}
								type="button"
								onClick={handleClickCert}
								className='importdatabase-inputs-button'
							/>
							<input type="file" onChange={handleInputCert} accept=".pem" ref={cert}/>
						</div>
					</div>}
				<div className='importdatabase-textbox'>
      		{error && <p>{error}</p>}
				</div>
				<p>
					Tart requires credentials to run your worksheet. Passwords are encrypted.
					Users have strict read access (Unable to edit, download, delete data within a database).
				</p>
				<br />
				<input
					className='modal-button'
					type="button"
					value="Cancel"
					onClick={handleClose}
				/>
				{loading
					? 	<div className='modal-button'>
							<Icon path={mdiLoading} size={1.5} spin/>
						</div>
					: 	<input
							disabled={isInvalid}
							className='modal-button'
							type="button"
							value="Connect"
							onClick={handleConnect}
							style={{color: isInvalid ? "rgb(0, 0, 0, 0.5)" : color[authUser.uid]}}
						/>
				}
			</div>
		</form>
	)
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
})

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  )
)(ImportDatabase)
