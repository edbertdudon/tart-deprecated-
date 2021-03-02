import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import {
  mdiDatabase, mdiFile, mdiTable, mdiDelete, mdiClockTimeNine,
} from '@mdi/js';

import SearchBar from './searchbar';
import * as ROUTES from '../../constants/routes';
import { OFF_COLOR } from '../../constants/off-color';

const Item = ({
  pathname, route, color, icon, text,
}) => (
  <li className="navigation-home-link" style={{ backgroundColor: pathname === route && OFF_COLOR[color] }}>
    <Link to={{ pathname: route }}>
      <div className="navigation-home-icon">
        <Icon path={icon} size={1.3} />
      </div>
      <div className="navigation-home-text">
        {text}
      </div>
    </Link>
  </li>
);

const Home = ({ color, pathname }) => (
  <div className="navigation-home" style={{ backgroundColor: color }}>
    <ul>
      <li>
        <h1 className="navigation-home-logo">
          <Link to={{ pathname: ROUTES.HOME }}>Sciepp</Link>
        </h1>
      </li>
      <li>
        <SearchBar />
      </li>
      <Item pathname={pathname} route={ROUTES.HOME} color={color} icon={mdiTable} text="Worksheets" />
      <Item pathname={pathname} route={ROUTES.JOBS} color={color} icon={mdiClockTimeNine} text="Jobs" />
      <Item pathname={pathname} route={ROUTES.CONNECTIONS} color={color} icon={mdiDatabase} text="Connections" />
      <Item pathname={pathname} route={ROUTES.INPUTS} color={color} icon={mdiFile} text="Inputs" />
      <Item pathname={pathname} route={ROUTES.TRASH} color={color} icon={mdiDelete} text="Trash" />
      {/* {!!authUser.roles[ROLES.ADMIN] && ( */}
      {/* <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li> */}
      {/* // )} */}
    </ul>
  </div>
);

export default Home;
