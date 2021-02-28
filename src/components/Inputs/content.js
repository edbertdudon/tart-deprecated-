import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import LoadingDataSource from '../Home/loadingdatasource';
import DataInput from './datainput';
import { withFirebase } from '../Firebase';

const Content = ({ firebase, authUser }) => {
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    firebase.doListInputs(authUser.uid).then((res) => {
      setInputs(res.items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-content">
      {loading
        ? <LoadingDataSource />
        : (inputs.length < 1
          ? <div className="home-content-search">Your inputs will appear here</div>
          : <div>
            {inputs.map((file, index) => (
                <DataInput
                  filename={file.name}
                  inputs={inputs}
                  onSetInputs={setInputs}
                  key={file.name}
                />
              ))}
            </div>
          )
      }
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
