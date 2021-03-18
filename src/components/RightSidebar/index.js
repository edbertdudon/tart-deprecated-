import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import statistics from '../Statistics/core/statisticsR';
import './index.less';

import Chart from '../Chart';
import Statistics from '../Statistics';
import Optimize from '../Optimize';

const RightSidebar = ({ rightSidebar, statistic, onSetRightSidebar }) => {
  const [scroll, setScroll] = useState(false);

  const RIGHTSIDEBAR_STATES = {
    chart: <Chart />,
    statistics: <Statistics statistic={statistic} />,
    optimize: <Optimize />,
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop > 15) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleClose = () => {
    onSetRightSidebar('none');
  };
  return (
    <div id="rightsidebar" className={(rightSidebar === 'none') ? 'slideout' : 'slidein'} onScroll={handleScroll}>
      {rightSidebar === 'optimize' && (
        <div className="rightsidebar-header" style={{ boxShadow: scroll && '0px 2px 5px -2px rgba(0,0,0,0.5)' }}>
          <div className="rightsidebar-heading">Optimize</div>
          <button type="button" className="rightsidebar-close" onClick={handleClose}>
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
      )}
      {rightSidebar === 'statistics' && (
        <div className="rightsidebar-header" style={{ boxShadow: scroll && '0px 2px 5px -2px rgba(0,0,0,0.5)' }}>
          <div className="rightsidebar-heading">
            {statistics.find((e) => e.key === statistic).title}
          </div>
          <button type="button" className="rightsidebar-close" onClick={handleClose}>
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
      )}
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  );
};

const mapStateToProps = (state) => ({
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RightSidebar);
