import React from "react";

class Load extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.state = { textAreaValue: JSON.stringify(this.props.system) };
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const system = JSON.parse(this.state.textAreaValue);
    this.props.onXyzFormSubmit(system);
  }

  handleFormInputChange(e) {
    this.setState({ textAreaValue: e.target.value });
  }

  render() {
    return (
      <div>
        <h1 className="title is-1">Load Atomic Configurations</h1>
        Paste xyz file data:
        <form onSubmit={this.handleFormSubmit}>
          <textarea
            id="xyz-data"
            rows="4"
            columns="20"
            value={this.state.textAreaValue}
            onChange={this.handleFormInputChange}
          />
          <br></br>
          <button id="xyz-button">Load</button>
        </form>
      </div>
    );
  }
}

export default Load;
