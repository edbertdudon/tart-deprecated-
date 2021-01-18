import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdilMagnify } from '@mdi/light-js';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SearchBar = ({
  onSetSearch, files, authUser, firebase, onSetFiles, search,
}) => {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    // Files + connections - trash
    firebase.doListFiles(authUser.uid).then((res) => {
      // onSetFiles(res.items, authUser.uid)
      const list = res.items.map((file) => file.name);
      firebase.connection(authUser.uid).get().then((docC) => {
        if (docC.exists) {
          const connections = Object.keys(docC.data());
          const allFiles = [...list, ...connections];
          firebase.trash(authUser.uid).get().then((docT) => {
            if (docT.exists) {
              const trash = Object.keys(docT.data());
              const filesLessTrash = allFiles.filter((file) => {
                if (!trash.includes(file)) {
                  return file;
                }
              });
              setLibrary(filesLessTrash);
            }
          });
        }
      });
    });
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    const filter = library.filter((file) => file.toLowerCase().includes(input.toLowerCase()));
    if (input.length > 0) {
      if (filter.length > 0) {
        onSetSearch({ input, filter });
      } else {
        onSetSearch({ input, filter: [] });
      }
    } else {
      onSetSearch({});
    }
  };

  return (
    <Link to={{ pathname: ROUTES.SEARCH }} className="navigation-search">
      <Icon path={mdilMagnify} size={1.2} />
      <input
        type="text"
        name="search"
        placeholder="Search"
        onChange={handleChange}
      />
    </Link>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  search: (state.searchState.search || {}),
  files: (state.filesState.files || {}),
});

const mapDispatchToProps = (dispatch) => ({
  onSetSearch: (search) => dispatch({ type: 'SEARCH_SET', search }),
  onSetFiles: (files, uid) => dispatch({ type: 'FILES_SET', files, uid }),
});

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withFirebase,
)(SearchBar);
