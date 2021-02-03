import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import DataConnection from './dataconnection';
import LoadingDataSource from '../Home/loadingdatasource';
import { withFirebase } from '../Firebase';

const Content = ({ firebase, authUser }) => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    setLoading(true);

    firebase.connection(authUser.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const list = Object.keys(doc.data());
          setConnections(list);
          setLoading(false);
        }
      });
  }, []);

  return (
    <div className="home-content">
      {loading
        ? <LoadingDataSource />
        : (connections.length < 1
          ? <div className="home-content-search">Your connections will appear here</div>
          : (
            <div>
              {connections.map((host) => (
                <DataConnection
                  name={host}
                  connections={connections}
                  onSetConnections={setConnections}
                  key={host}
                />
              ))}
            </div>
          )
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
