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

        // Prepare data for Heatmap: [x, y, value]
        // X: Age Group, Y: Severity
        const ageGroups = ['0-17', '18-25', '26-35', '36-50', '51-65', '65+'];
        const severities = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        const seriesData = data.heatmap.map(item => [
            ageGroups.indexOf(item.ageGroup),
            severities.indexOf(item.severity.toString()),
            item.count
        ]);

        const option = {
            title: {
                text: 'Severity by Age Group Heatmap',
                left: 'center'
            },
            tooltip: {
                position: 'top'
            },
            grid: {
                height: '70%',
                top: '15%'
            },
            xAxis: {
                type: 'category',
                data: ageGroups,
                splitArea: {
                    show: true
                },
                name: 'Age Group'
            },
            yAxis: {
                type: 'category',
                data: severities,
                splitArea: {
                    show: true
                },
                name: 'Severity'
            },
            visualMap: {
                min: 0,
                max: Math.max(...data.heatmap.map(d => d.count), 10),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '0%'
            },
            series: [{
                name: 'Report Count',
                type: 'heatmap',
                data: seriesData,
                label: {
                    show: true
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        chart.setOption(option);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Demographic Heatmap</h1>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[600px]" in:fade>
        <div bind:this={chartContainer} class="w-full h-[600px]"></div>
    </div>
</div>
