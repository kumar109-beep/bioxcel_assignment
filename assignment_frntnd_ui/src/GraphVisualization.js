// src/Graph.js

import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, edges }) => {
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;

    let svg = d3.select("#graph");
    
    let simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d) => d.id))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(400, 300));

    simulation.alphaTarget(0);

    let link = svg
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link");

    let node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 8)
      .call(drag(simulation));

    let nodeLabels = svg
      .selectAll(".node-label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "node-label")
      .attr("font-size", "10px")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      nodeLabels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [nodes, edges]);

  return (
    <svg
      id="graph"
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
    ></svg>
  );
};

export default Grap