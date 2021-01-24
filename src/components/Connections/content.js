import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import DataConnection from './dataconnection';
import { withFirebase } from '../Firebase';

const Content = ({ firebase, authUser }) => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    setLoading(true);

    firebase.connection(authUser.uid).get()
      .then((docC) => {
        if (docC.exists) {
          const allConnections = Object.keys(docC.data());
          firebase.trash(authUser.uid).get().then((docT) => {
            if (docT.exists) {
              const list = Object.keys(docT.data());
              const connectionsLessTrash = allConnections.filter((connection) => {
                if (!list.includes(connection)) {
                  return connection;
                }
              });
              setConnections(connectionsLessTrash);
            }
          });
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-content">
      {(connections.length < 1
        ? <div className="home-content-search">Your connections will appear here</div>
        : <div>
            {connections.map((host) => (
              <DataConnection
                name={host}
                connections={connections}
                onSetConnections={setConnections}
                key={host}
              />
            ))}
          </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(Content);
