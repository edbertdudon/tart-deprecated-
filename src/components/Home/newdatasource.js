import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdilPlus } from '@mdi/light-js';
import { mdiLoading } from '@mdi/js';
import { getMaxNumberCustomSheet } from '../../functions';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { DEFAULT_INITIAL_SLIDES } from '../../constants/default';

const NewDataSource = ({
  firebase, authUser, worksheets, onSetWorksheetname,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleOpen = () => {
    setIsLoading(true);

    const filename = `Untitled Worksheet ${
			 getMaxNumberCustomSheet(
			  worksheets.map((worksheet) => worksheet.name),
			  'Untitled Worksheet ',
      )}`;

    firebase.doUploadWorksheet(
      authUser.uid,
      filename,
      new File(
        [JSON.stringify(DEFAULT_INITIAL_SLIDES)],
        filename,
        { type: 'application/json' },
      ),
    ).on('state_changed', () => {}, () => {}, (snapshot) => {
      onSetWorksheetname(filename, authUser.uid);
      history.push(ROUTES.WORKSHEET);
    });
  };

  return (
    <div className="datasource-thumbnail">
      <div className="newdatasource-button" onClick={handleOpen}>
        <div className="datasource-icon">
          {isLoading
					  ? <Icon path={mdiLoading} size={5} spin />
					  : <Icon path={mdilPlus} size={5} />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheets: (state.worksheetsState.worksheets || []),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NewDataSource);
