<script>
    import SideEffectsChart from '$lib/components/charts/SideEffectsChart.svelte';
    import InteractionGraph from '$lib/components/charts/InteractionGraph.svelte';
</script>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Data Visualization</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
            <h2 class="text-xl font-semibold">Adverse Drug Reactions</h2>
            <p class="text-muted-foreground text-sm text-gray-500">
                Distribution of reported side effects across biological sex. Note the disparity in nausea and dizziness reports.
            </p>
            <SideEffectsChart />
        </div>

        <div class="space-y-4">
            <h2 class="text-xl font-semibold">Interaction Network</h2>
            <p class="text-muted-foreground text-sm text-gray-500">
                Complex interactions between drugs, enzymes, and hormonal factors affecting metabolism.
            </p>
            <InteractionGraph />
        </div>
    </div>
</div>
