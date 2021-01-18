import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import './index.less';

import Chart from '../Chart';
import Statistics from '../Statistics';
import Optimize from '../Optimize';

const RightSidebar = ({ rightSidebar, statistic }) => {
  const RIGHTSIDEBAR_STATES = {
    chart: <Chart />,
    statistics: <Statistics statistic={statistic} />,
    optimize: <Optimize />,
  };

  return (
    <div id="rightsidebar" className={(rightSidebar === 'none') ? 'slideout' : 'slidein'}>
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  );
};

const mapStateToProps = (state) => ({
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(RightSidebar);
