import React, { useState } from 'react';
import { compose } from 'recompose';
import './index.less';

import { withAuthorization, withEmailVerification } from '../Session';
import Content from './content';
import Header from './header';

const Home = (props) => {
  const [scroll, setScroll] = useState(false);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 15) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  return (
    <div className="home" style={{ boxShadow: scroll && '0px 2px 5px -2px rgba(0,0,0,0.5)' }}>
      <Header />
      <Content nextProps={props} onSetScroll={handleScroll} />
    </div>
  );
};

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Home);
