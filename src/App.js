import React from "react";
import Navbar from "./components/Navbar";
import { HashRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Load from "./pages/Load";
import Select from "./pages/Select";
import View from "./pages/View";

let water = {
  atoms: {
    1: {
      symbol: "O",
      position: { x: 0, y: 0, z: 0 },
    },
    2: {
      symbol: "H",
      position: { x: 0.758602, y: 0.0, z: 0.504284 },
    },
    3: {
      symbol: "H",
      position: { x: 0.758602, y: 0.0, z: -0.504284 },
    },
  },
  bonds: [
    {
      atomA: 1,
      atomB: 2,
    },
    {
      atomA: 1,
      atomB: 3,
    },
  ],
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onXyzFormSubmit = this.onXyzFormSubmit.bind(this);
    this.state = { system: water };
  }

  onXyzFormSubmit(new_system) {
    console.log(new_system);
    this.setState({ system: new_system });
  }

  render() {
    const system = this.state.system;
    console.log("Render in App for system:", system);
    return (
      <div id="outer-container">
        <HashRouter>
          <Navbar />
          <main id="page-wrap">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                path="/load"
                render={(props) => (
                  <Load
                    {...props}
                    system={system}
                    onXyzFormSubmit={this.onXyzFormSubmit}
                  />
                )}
              />
              <Route path="/select" component={Select} />
              <Route
                path="/view"
                render={(props) => <View {...props} system={system} />}
              />
            </Switch>
          </main>
        </HashRouter>
      </div>
    );
  }
}

export default App;
