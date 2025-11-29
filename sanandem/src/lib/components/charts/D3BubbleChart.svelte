<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let svg;
  let width = 600;
  let height = 400;

  const data = [
    { id: "Nausea", group: 1, value: 45 },
    { id: "Dizziness", group: 1, value: 38 },
    { id: "Headache", group: 1, value: 30 },
    { id: "Fatigue", group: 2, value: 28 },
    { id: "Rash", group: 2, value: 15 },
    { id: "Insomnia", group: 2, value: 12 },
    { id: "Anxiety", group: 3, value: 20 },
    { id: "Tremor", group: 3, value: 10 }
  ];

  onMount(() => {
    const simulation = d3.forceSimulation(data)
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => d.value + 5));

    const svgEl = d3.select(svg);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = svgEl.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", d => d.value)
        .attr("fill", d => color(d.group.toString()))
        .attr("opacity", 0.8)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

    const labels = svgEl.selectAll("text")
        .data(data)
        .join("text")
        .text(d => d.id)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .style("pointer-events", "none");

    simulation.on("tick", () => {
        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
  });
</script>

<div class="border rounded-lg p-4 bg-white shadow flex justify-center w-full">
    <svg bind:this={svg} viewBox={`0 0 ${width} ${height}`} class="w-full h-auto max-h-[400px]"></svg>
</div>
