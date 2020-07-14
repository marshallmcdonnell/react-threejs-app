import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { push as Menu } from "react-burger-menu";

class Navbar extends React.Component {
  render() {
    return (
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <NavLink className="menu-item" activeClassName="is-active" to="/">
          Home
        </NavLink>

        <NavLink className="menu-item" activeClassName="is-active" to="/load">
          Load
        </NavLink>

        <NavLink className="menu-item" activeClassName="is-active" to="/select">
          Select
        </NavLink>

        <NavLink className="menu-item" activeClassName="is-active" to="/view">
          View
        </NavLink>
      </Menu>
    );
  }
}

export default Navbar;
