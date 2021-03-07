//
//  view.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Header from './header';
// import OFF_COLOR from '../../constants/off-color';

const View = ({
  slides, rightSidebar, onSetRightSidebar, navigator, setNavigator,
}) => {
  const VIEW_DROPDOWN = [
    { key: 'Navigator', type: 'toggle', visibility: navigator },
    { key: 'Format Chart', type: 'toggle', visibility: rightSidebar === 'chart' },
  ];

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      onSetRightSidebar(select);
      return;
    }
    onSetRightSidebar('none');
  };

  const handleView = (key) => {
    const { sheet, options } = slides;
    switch (key) {
      case VIEW_DROPDOWN[0].key: {
        setNavigator(!navigator);

        if (navigator) {
          sheet.table.el.style.marginLeft = '0';
          // sheet.chartEl.el.style.left = '30px';
          sheet.overlayerEl.el.style.left = '0';
          sheet.horizontalScrollbar.el.el.style.left = '0';
          options.showNavigator = false;
        } else {
          sheet.table.el.style.marginLeft = '125px';
          // sheet.chartEl.el.style.left = '155px';
          sheet.overlayerEl.el.style.left = '125px';
          sheet.horizontalScrollbar.el.el.style.left = '125px';
          options.showNavigator = true;
        }
        break;
      }
      case VIEW_DROPDOWN[1].key: {
        handleToggle('chart');
        break;
      }
      default:
    }
  };

  return (
    <Header
      classname="dropdown-content"
      text="View"
      items={VIEW_DROPDOWN}
      onSelect={handleView}
      // color={OFF_COLOR[color[authUser.uid]]}
    />
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
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
)(View);
