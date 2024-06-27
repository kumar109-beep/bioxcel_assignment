import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './GraphVisualization.css'; // Import the CSS file
import GraphVisualization from './GraphVisualization'; // Import the fetchGraphData function


function App() {

  return (
    <div className="App">
      <header>
        <h3>Bioxcel Assignment - Full Stack Developer</h3>
      </header>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 mt-2">
            <div className="card">
              <div id="parent-nodes">
                <b>
                  Directly Connected Parent Nodes with:
                  <span id="selected-parent">!</span>
                </b>
                <hr />
                <input
                  type="text"
                  id="parent-search"
                  className="form-control mb-2"
                  placeholder="Search parent nodes..."
                />
                <ul id="parent-list"></ul>
                <hr />
                <b>Connected Child Nodes</b>
                <ul id="child-list"></ul>
              </div>
            </div>
          </div>
          <div className="col-md-9 mt-2">
              <GraphVisualization />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
