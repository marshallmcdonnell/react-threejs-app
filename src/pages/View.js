import React from "react";
import Scene from "../components/Scene";

const View = (props) => (
  <div>
    <h1 className="title is-1">View Atomic Configuration</h1>

    <Scene {...props} />
  </div>
);

export default View;
