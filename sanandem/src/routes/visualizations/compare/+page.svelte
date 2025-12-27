<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import * as echarts from 'echarts';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Button, Input, Label, Select } from 'flowbite-svelte';
    import { ArrowRight, Search } from 'lucide-svelte';

    // Props
    let { data } = $props();

    // State
    let med1 = $state(data.med1 || '');
    let med2 = $state(data.med2 || '');
    let chartContainer: HTMLElement;
    let chart: echarts.ECharts;

    // Derived
    let comparisonData = $derived(data.comparison);

    function handleCompare() {
        const query = new URLSearchParams($page.url.searchParams);
        if (med1) query.set('med1', med1);
        if (med2) query.set('med2', med2);
        goto(`?${query.toString()}`);
    }

    onMount(() => {
        if (comparisonData && chartContainer) {
            initChart();
        }

        const handleResize = () => chart?.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart?.dispose();
        };
    });

    $effect(() => {
        if (comparisonData && chart) {
            updateChart();
        }
    });

    function initChart() {
        chart = echarts.init(chartContainer);
        updateChart();
    }

    function updateChart() {
        if (!comparisonData) return;

        const option = {
            title: {
                text: 'Medication Comparison',
                left: 'center',
                textStyle: { color: '#333' }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [comparisonData.med1.name, comparisonData.med2.name],
                bottom: 10
            },
            radar: {
                indicator: [
                    { name: 'Avg Severity', max: 10 },
                    { name: 'Side Effect Count', max: 20 }, // approximate max
                    { name: 'Report Count (Scaled)', max: 100 },
                    { name: 'Effect Duration (Hours)', max: 72 },
                    { name: 'Positive Ratio', max: 1 }
                ],
                radius: '65%'
            },
            series: [{
                name: 'Comparison',
                type: 'radar',
                data: [
                    {
                        value: [
                            comparisonData.med1.avgSeverity,
                            comparisonData.med1.avgSideEffects,
                            Math.min(comparisonData.med1.count, 100), // Scale for viz
                            comparisonData.med1.avgDuration,
                            comparisonData.med1.positiveRatio
                        ],
                        name: comparisonData.med1.name,
                        itemStyle: { color: '#3b82f6' }
                    },
                    {
                        value: [
                            comparisonData.med2.avgSeverity,
                            comparisonData.med2.avgSideEffects,
                            Math.min(comparisonData.med2.count, 100),
                            comparisonData.med2.avgDuration,
                            comparisonData.med2.positiveRatio
                        ],
                        name: comparisonData.med2.name,
                        itemStyle: { color: '#ef4444' }
                    }
                ]
            }]
        };

        chart.setOption(option);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Medication Comparison Tool</h1>

    <!-- Search Controls -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
                <Label for="med1" class="mb-2">Medication A</Label>
                <div class="relative">
                    <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input id="med1" bind:value={med1} class="pl-10" placeholder="e.g. Ibuprofen" />
                </div>
            </div>

            <div class="hidden md:flex justify-center items-center pb-3">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                    <ArrowRight class="w-6 h-6 text-gray-500" />
                </div>
            </div>

            <div>
                <Label for="med2" class="mb-2">Medication B</Label>
                <div class="relative">
                    <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input id="med2" bind:value={med2} class="pl-10" placeholder="e.g. Acetaminophen" />
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-center">
            <Button on:click={handleCompare} size="lg" color="primary" class="w-full md:w-auto px-8">
                Compare Medications
            </Button>
        </div>
    </div>

    <!-- Results -->
    {#if comparisonData}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" in:fade>
            <!-- Chart -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[400px] flex items-center justify-center">
                <div bind:this={chartContainer} class="w-full h-[400px]"></div>
            </div>

            <!-- Stats Table -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 class="text-xl font-semibold mb-6 dark:text-white">Detailed Statistics</h3>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead class="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
                            <tr>
                                <th class="px-6 py-3">Metric</th>
                                <th class="px-6 py-3 text-blue-600">{comparisonData.med1.name}</th>
                                <th class="px-6 py-3 text-red-600">{comparisonData.med2.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b dark:border-gray-700">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Total Reports</td>
                                <td class="px-6 py-4">{comparisonData.med1.count}</td>
                                <td class="px-6 py-4">{comparisonData.med2.count}</td>
                            </tr>
                            <tr class="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Avg. Severity (1-10)</td>
                                <td class="px-6 py-4">{comparisonData.med1.avgSeverity.toFixed(1)}</td>
                                <td class="px-6 py-4">{comparisonData.med2.avgSeverity.toFixed(1)}</td>
                            </tr>
                             <tr class="border-b dark:border-gray-700">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Avg. Side Effects</td>
                                <td class="px-6 py-4">{comparisonData.med1.avgSideEffects.toFixed(1)}</td>
                                <td class="px-6 py-4">{comparisonData.med2.avgSideEffects.toFixed(1)}</td>
                            </tr>
                            <tr class="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Positive Experience Ratio</td>
                                <td class="px-6 py-4">{(comparisonData.med1.positiveRatio * 100).toFixed(0)}%</td>
                                <td class="px-6 py-4">{(comparisonData.med2.positiveRatio * 100).toFixed(0)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {:else if med1 || med2}
         <div class="text-center py-12 text-gray-500" in:fade>
            <p class="text-lg">Click "Compare Medications" to see the analysis.</p>
        </div>
    {:else}
        <div class="text-center py-12 text-gray-500" in:fade>
            <p class="text-lg">Enter two medication names to begin.</p>
        </div>
    {/if}
</div>
