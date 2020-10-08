import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import {store, persistor} from './components/Store'
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase'

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<FirebaseContext.Provider value={new Firebase()}>
				<App />
			</FirebaseContext.Provider>
		</PersistGate>
	</Provider>,
  document.getElementById('app')
);

module.hot.accept();
