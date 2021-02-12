import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

export const config = {
  apiKey: 'AIzaSyAqv3D9s51zCIBDzJc0sLw2Rak3lUEvtFA',
  authDomain: 'tart-90ca2.firebaseapp.com',
  databaseURL: 'https://tart-90ca2.firebaseio.com',
  projectId: 'tart-90ca2',
  storageBucket: 'tart-90ca2.appspot.com',
  messagingSenderId: '726799230235',
  appId: '1:726799230235:web:fb02f6f811b1101e83dfbe',
  measurementId: 'G-B2WK4MFZL7',
};

// const fetchG = (func, data, idToken) => fetch(process.env.CLOUD_FUNCTIONS_URL + func, {
function fetchG(func, data, idToken) {
  return fetch(process.env.CLOUD_FUNCTIONS_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });
}

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.functions = app.functions();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password)

  doSendEmailVerification = () => {
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });
  }

  doVerifyEmail = (actionCode) => this.auth.applyActionCode(actionCode)

  doVerifyPasswordResetCode = (actionCode) => this.auth.verifyPasswordResetCode(actionCode)

  doConfirmPasswordReset = (actionCode, newPassword) => this.auth.confirmPasswordReset(actionCode, newPassword)

  // *** Merge Auth and DB User API ***

  onAuthUserListener = (next, fallback) => this.auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      this.user(authUser.uid)
        .get()
        .then((doc) => {
          const dbUser = doc.data();
          // default empty roles
          if (!dbUser.roles) {
            dbUser.roles = {};
          }
          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser,
          };
          next(authUser);
        });
    } else {
      fallback();
    }
  })

  // *** Storage API ***

  doListWorksheets = (uid) => this.storage.ref(`user/${uid}/worksheets`).listAll()

  doUploadWorksheet = (uid, filename, file) => this.storage.ref(`user/${uid}/worksheets/${filename}`).put(file)

  doDownloadWorksheet = (uid, filename) => this.storage.ref(`user/${uid}/worksheets/${filename}`)
    .getDownloadURL()
    .then((url) => fetch(url, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => res))
    .then((res) => res)

  doDeleteWorksheet = (uid, filename) => this.storage.ref(`user/${uid}/worksheets/${filename}`).delete()

  doMoveToWorksheets = (uid, filename) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG('moveToWorksheets', { uid, filename }, authToken))

  doRenameWorksheet = (uid, src, dest) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG('renameWorksheet', { uid, src, dest }, authToken))

  doListInputs = (uid) => this.storage.ref(`user/${uid}/inputs`).listAll()

  doUploadInput = (uid, filename, file) => this.storage.ref(`user/${uid}/inputs/${filename}`).put(file)

  doListTrash = (uid) => this.storage.ref(`user/${uid}/trash`).listAll()

  doMoveToTrash = (uid, filename) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG('moveToTrash', { uid, filename }, authToken))

  doUploadTrash = (uid, filename, file) => this.storage.ref(`user/${uid}/trash/${filename}`).put(file)

  doDeleteTrash = (uid, filename) => this.storage.ref(`user/${uid}/trash/${filename}`).delete()

  // *** Dataproc API ***

  doRunWorksheet = (authUser, filename, jobFileArgument) => fetchG('createandsubmit', {
    authuser: authUser.toLowerCase(),
    jobFileArgument,
    worksheet: filename.replace(/\s/g, '').toLowerCase(),
  }).then((res) => res.text())

  doCancelWorksheet = (jobId, authuser, filename) => fetchG('canceljob', {
    jobId,
    authuser: authuser.toLowerCase(),
    filename,
  })

  doListJobs = (authUser) => fetchG('listjobs', {
    authuser: authUser.toLowerCase(),
  }).then((res) => res.json())

  // *** Database Connector API ***

  doConnect = (connector, data) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG(connector, data, authToken)
      .then((res) => res.json())
      .then((res) => res))

  doListDatabases = (connector, data) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG(connector, data, authToken)
      .then((res) => res.json())
      .then((res) => res));

  doListTables = (connector, data) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG(connector, data, authToken)
      .then((res) => res.json())
      .then((res) => res))

  doGetTableSample = (connector, data) => this.auth.currentUser.getIdToken()
    .then((authToken) => fetchG(connector, data, authToken)
      .then((res) => res.json())
      .then((res) => res))

  // *** User API ***

	user = (uid) => this.db.collection('users').doc(uid)

	users = () => this.db.collection('users')

	// *** Database Connections API ***

	connection = (uid) => this.db.collection('connections').doc(uid)

	connections = () => this.db.collection('connections')

	doDeleteConnectionsField = (uid, filename) => this.db.collection('connections').doc(uid).update({ [filename]: app.firestore.FieldValue.delete() })

	// *** Trash API ***

	trash = (uid) => this.db.collection('trash').doc(uid)

	trashs = () => this.db.collection('trash')

	doDeleteTrashField = (uid, filename) => this.db.collection('trash').doc(uid).update({ [filename]: app.firestore.FieldValue.delete() })
}

export default Firebase;
