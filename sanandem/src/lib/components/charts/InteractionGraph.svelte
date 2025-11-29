<script>
  import { Chart } from 'svelte-echarts';
  import { interactionGraph } from '$lib/data';

  const nodes = interactionGraph.nodes.map(node => ({
    id: node.id,
    name: node.id,
    value: node.value,
    symbolSize: node.value * 2,
    category: node.group,
    label: { show: true }
  }));

  const links = interactionGraph.links.map(link => ({
    source: link.source,
    target: link.target,
    value: link.value
  }));

  const categories = [
    { name: 'Drug' },
    { name: 'Biological Target' },
    { name: 'Effect' },
    { name: 'Hormone' }
  ];

  const options = {
    title: {
      text: 'Interaction Network',
      subtext: 'Force Directed Graph',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        data: categories.map(function (a) {
          return a.name;
        })
      }
    ],
    series: [
      {
        name: 'Interaction',
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        categories: categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        }
      }
    ]
  };
</script>

<div class="h-[500px] w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
  <Chart {options} />
</div>
