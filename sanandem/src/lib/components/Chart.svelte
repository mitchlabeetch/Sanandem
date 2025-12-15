<script lang="ts">
    import echarts from 'echarts';
    import { onMount } from 'svelte';

    let { options } = $props();
    let chartContainer: HTMLDivElement;
    let chartInstance: echarts.ECharts | null = null;

    $effect(() => {
        if (chartInstance && options) {
            chartInstance.setOption(options);
        }
    });

    onMount(() => {
        if (chartContainer) {
            chartInstance = echarts.init(chartContainer);
            chartInstance.setOption(options);

            const handleResize = () => chartInstance?.resize();
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chartInstance?.dispose();
            };
        }
    });
</script>

<div bind:this={chartContainer} class="w-full h-full"></div>
