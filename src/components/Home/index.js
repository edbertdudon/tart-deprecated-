import React from 'react';
import { compose } from 'recompose';
import './index.less';

import { withAuthorization, withEmailVerification } from '../Session';
import Content from './content';
import Header from './header';

const Home = (props) => (
  <div className="home">
    <Header />
    <Content nextProps={props} />
  </div>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Home);
