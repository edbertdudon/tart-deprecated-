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
  firebase, worksheets, authUser, search, onSetWorksheets, onSetSearch,
}) => {
  const [inputs, setInputs] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    firebase.doListWorksheets(authUser.uid).then((res) => {
      onSetWorksheets(res.items);
    });

    firebase.doListInputs(authUser.uid).then((res) => {
      const is = res.items.map((input) => input.name);
      setInputs(is);
    });

    firebase.connection(authUser.uid).get().then((docC) => {
      if (docC.exists) {
        setConnections(Object.keys(docC.data()));
      }
    });
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    const ws = worksheets
      .map((worksheet) => worksheet.name)
      .filter((file) => file.toLowerCase().includes(input.toLowerCase()));

    const is = inputs.filter((file) => file.toLowerCase().includes(input.toLowerCase()));

    const cs = connections.filter((file) => file.toLowerCase().includes(input.toLowerCase()));

    onSetSearch({
      input, ws, is, cs,
    });
  };

  return (
    <Link to={{ pathname: ROUTES.SEARCH }} className="navigation-search">
      <Icon path={mdilMagnify} size={1.2} />
      <input
        type="text"
        value={search.input}
        name="search"
        placeholder="Search"
        onChange={handleChange}
      />
    </Link>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  search: (state.searchState.search || {
    input: '', ws: [], is: [], cs: [],
  }),
  worksheets: (state.worksheetsState.worksheets || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetSearch: (search) => dispatch({ type: 'SEARCH_SET', search }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
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
