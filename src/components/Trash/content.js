import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import LoadingDataSource from '../Home/loadingdatasource';
import DataTrash from './datatrash';
import { withFirebase } from '../Firebase';

const Content = ({ firebase, authUser }) => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [trash, setTrash] = useState([]);

  useEffect(() => {
    setLoading(true);
    firebase.doListTrash(authUser.uid).then((res) => {
      setTrash(res.items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-content">
      <div className="home-content-message">Worksheets in trash will be permanently deleted after 30 days.</div>
      {loading
        ? <LoadingDataSource />
        : ((connections.length < 1 && trash.length < 1)
          ? <div className="home-content-search">Trash is empty</div>
          : (
            <div>
              {trash.map((file, index) => (
                <DataTrash
                  name={file.name}
                  trash={trash}
                  connections={connections}
                  onSetTrash={setTrash}
                  onSetConnections={setConnections}
                  key={index}
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
