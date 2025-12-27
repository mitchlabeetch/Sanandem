<script lang="ts">
    import { onMount } from 'svelte';
    import * as echarts from 'echarts';
    import { fade } from 'svelte/transition';

    let { data } = $props();

    let chartContainer: HTMLElement;
    let chart: echarts.ECharts;

    onMount(() => {
        if (chartContainer) {
            initChart();
        }

        const handleResize = () => chart?.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart?.dispose();
        };
    });

    function initChart() {
        chart = echarts.init(chartContainer);

        const dates = data.trends.map(d => d.date);
        const counts = data.trends.map(d => d.count);
        const avgSeverity = data.trends.map(d => d.avgSeverity);

        const option = {
            title: {
                text: 'Reports Trend (Last 30 Days)',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Report Count', 'Avg Severity'],
                bottom: 10
            },
            xAxis: {
                type: 'category',
                data: dates
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Count'
                },
                {
                    type: 'value',
                    name: 'Severity',
                    min: 0,
                    max: 10
                }
            ],
            series: [
                {
                    name: 'Report Count',
                    type: 'line',
                    smooth: true,
                    data: counts,
                    areaStyle: {}
                },
                {
                    name: 'Avg Severity',
                    type: 'line',
                    yAxisIndex: 1,
                    data: avgSeverity,
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            ]
        };

        chart.setOption(option);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Trend Analysis</h1>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[500px]" in:fade>
        <div bind:this={chartContainer} class="w-full h-[500px]"></div>
    </div>
</div>
