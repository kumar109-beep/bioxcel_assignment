import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualization = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    let svg = d3.select(svgRef.current);
    let nodes = [];
    let edges = [];

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/graph/");
        const data = await response.json();

        nodes = data.nodes.map((node) => ({ id: node, isChild: false }));
        edges = data.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        }));

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
          .call(drag(simulation))
          .on("click", clickNode); // Attach click event here

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

        function clickNode(event, d) {
          document.getElementById("selected-parent").innerHTML = d.id;

          fetch(`http://127.0.0.1:8000/api/child-nodes/${d.id}/`)
            .then((response) => response.json())
            .then((childNodesData) => {
              let newNodes = childNodesData.map((node) => ({ id: node, isChild: true }));
              let newEdges = childNodesData.map((node) => ({ source: d.id, target: node }));

              fetch(`http://127.0.0.1:8000/api/parent-connected-nodes/${d.id}/`)
                .then((response) => response.json())
                .then((parentNodesData) => {
                  let newParentNodes = parentNodesData.map((node) => ({ id: node, isChild: false }));

                  newParentNodes.forEach((node) => {
                    if (!nodes.some((n) => n.id === node.id)) {
                      nodes.push(node);
                    }
                  });

                  let parentEdges = parentNodesData.map((node) => ({ source: node, target: d.id }));
                  edges.push(...parentEdges);

                  newNodes.forEach((node) => {
                    if (!nodes.some((n) => n.id === node.id)) {
                      nodes.push(node);
                    }
                  });

                  edges.push(...newEdges);

                  simulation.nodes(nodes);
                  simulation.force("link").links(edges);
                  simulation.alpha(1).restart();

                  link = link.data(edges);
                  link.exit().remove();
                  link = link.enter().append("line").attr("class", "link").merge(link);

                  node = node.data(nodes);
                  node.exit().remove();
                  node = node.enter().append("circle")
                    .attr("class", (d) => d.isChild ? "childnode" : "node")
                    .attr("r", 6)
                    .call(drag(simulation))
                    .on("click", clickNode)
                    .merge(node);

                  nodeLabels = nodeLabels.data(nodes);
                  nodeLabels.exit().remove();
                  nodeLabels = nodeLabels.enter().append("text")
                    .attr("class", "node-label")
                    .attr("font-size", "10px")
                    .attr("dx", 10)
                    .attr("dy", ".35em")
                    .text((d) => d.id)
                    .merge(nodeLabels);

                  updateParentNodesList(parentNodesData);
                  updateChildNodesList(childNodesData);
                  highlightParentNode(d.id);
                })
                .catch((error) => console.error("Error fetching parent nodes:", error));
            })
            .catch((error) => console.error("Error fetching child nodes:", error));
        }

        function updateParentNodesList(parentNodesData) {
          let parentList = d3.select("#parent-list");
          parentList.selectAll("li").remove();
          parentList.selectAll("li")
            .data(parentNodesData)
            .enter()
            .append("li")
            .text((d) => d);
        }

        function updateChildNodesList(childNodesData) {
          let childList = d3.select("#child-list");
          childList.selectAll("li").remove();
          childList.selectAll("li")
            .data(childNodesData)
            .enter()
            .append("li")
            .text((d) => d);
        }

        function highlightParentNode(parentNodeId) {
          svg.selectAll(".node")
            .attr("class", "node")
            .attr("fill", "skyblue");

          svg.selectAll(".node")
            .filter((d) => d.id === parentNodeId)
            .attr("class", "node highlighted")
            .attr("fill", "orange");
        }

        // Initial fetch done, set up event listeners or anything else here
        document.getElementById("parent-search").addEventListener("input", function () {
          let searchTerm = this.value.trim().toLowerCase();
          if (searchTerm.length === 0) return;

          let filteredParentNodes = nodes.filter(
            (node) => !node.isChild && node.id.toLowerCase().includes(searchTerm)
          );

          updateParentNodesList(filteredParentNodes.map((node) => node.id));

          if (filteredParentNodes.length > 0) {
            highlightParentNode(filteredParentNodes[0].id);
          } else {
            svg.selectAll(".node")
              .attr("class", "node")
              .attr("fill", "skyblue");
          }
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {};

  }, []);

  return (
    <div id="graph-container">
      <svg
        ref={svgRef}
        id="graph"
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  );
};

export default GraphVisualization;
