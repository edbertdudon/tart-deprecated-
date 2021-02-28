import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import { useOutsideClick } from '../../functions';
import './index.less';

const Item = ({ text, onSelect }) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  return (
    <div
      className="dropdown-item"
      onClick={() => onSelect(text)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      // style={{ backgroundColor: hover && color, color: hover ? '#fff' : '#000000' }}
    >
      {text}
    </div>
  );
};

const Redirect = ({ path, text }) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  return (
    <Link
      to={{ pathname: path }}
      className="dropdown-item"
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      // style={{ backgroundColor: hover && color, color: hover ? '#fff' : '#000000' }}
    >
      {text}
    </Link>
  );
};

const Toggle = ({
  text, onSelect, isOpen,
}) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  return (
    <div
      className="dropdown-item"
      onClick={() => onSelect(text)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      // style={{ backgroundColor: hover && color, color: hover ? '#fff' : '#000000' }}
    >
      {(isOpen ? 'Hide ' : 'Show ') + text}
    </div>
  );
};

const SecondaryMenu = ({
  text, items, style, onSelect, color,
}) => {
  const [hover, setHover] = useState(false);
  const [hoverFirst, setHoverFirst] = useState(false);

  const handleHover = () => setHover(!hover);

  const handleHoverFirst = () => setHoverFirst(!hoverFirst);

  return (
    <div className="dropdown" onMouseEnter={handleHover} onMouseLeave={handleHover}>
      <div
        className="dropdown-item"
        onMouseEnter={handleHoverFirst}
        onMouseLeave={handleHoverFirst}
        // style={{
        //   backgroundColor: hover && (hoverFirst ? color : 'rgba(0, 0, 0, 0.05)'),
        //   color: hoverFirst ? '#fff' : '#000000'
        // }}
      >
        {text}
        <div className="dropdown-item-arrow">
          <Icon path={mdiChevronRight} size={0.9} />
        </div>
      </div>
      {hover
        && (
        <div className="dropdown-content-second" style={style}>
          {items.map((item) => (
            <Item
              text={item.pt}
              onSelect={() => onSelect(text, item.pt)}
              color={color}
              key={item.pt}
            />
          ))}
        </div>
        )}
    </div>
  );
};

const getDropdownStates = (item, i, onSelect, color, component, isOpen) => ({
  item: <Item text={item.key} onSelect={onSelect} key={item.key} color={color} />,
  link: <Redirect text={item.key} path={item.path} key={item.key} color={color} />,
  toggle: <Toggle
    text={item.key}
    onSelect={onSelect}
    key={item.key}
    isOpen={isOpen}
    color={color}
  />,
  secondarymenu: <SecondaryMenu
    text={item.key}
    items={item.options}
    style={item.style}
    onSelect={onSelect}
    color={color}
    key={item.key}
  />,
  component: <div key={item.key}>{component}</div>,
  divider: <hr key={i} />,
});

const withDropdown = (Component) => (props) => {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useOutsideClick(wrapperRef, setIsOpen);

  const handleOpen = () => setIsOpen(!isOpen);

  const handleHover = () => setHover(!hover);

  const handleSelect = (selection, second) => {
    setIsOpen(!isOpen);
    props.onSelect(selection, second);
  };

  const rect = wrapperRef.current && wrapperRef.current.getBoundingClientRect();

  return (
    <div className="dropdown" ref={wrapperRef}>
      <Component
        text={props.text}
        hover={hover}
        onHover={handleHover}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onOpen={handleOpen}
        color={props.color}
        style={props.style}
      />
      {isOpen
        && (
        <div
          className={props.classname}
          style={{
            left: (wrapperRef.current && (rect.right + rect.width) > window.innerWidth)
              && '45px',
            top: (wrapperRef.current
              && (rect.bottom + (props.items.length * 32)) > window.innerHeight)
              && `-${props.items.length * 32 - 40}px`,
          }}
          ref={contentRef}
        >
          {props.items.map((item, i) => getDropdownStates(
            item, i, handleSelect, props.color, item.component, item.visibility,
          )[item.type])}
        </div>
        )}
    </div>
  );
};

export default withDropdown;
