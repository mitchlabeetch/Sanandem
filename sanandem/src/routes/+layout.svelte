<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import DisclaimerBanner from '$lib/components/DisclaimerBanner.svelte';
    let { children } = $props();
</script>

<svelte:head>
    <title>Sanandem - Open Medical Research Data</title>
    <meta name="description" content="Sanandem is an open research platform for visualizing global health data, empowering medical research, and improving medication safety through anonymous reporting." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0f172a" />
</svelte:head>

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow-lg ring-2 ring-white">
    Skip to content
</a>

<div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
    <DisclaimerBanner />
    <Navbar />
    <main id="main-content" class="flex-grow">
        {@render children()}
    </main>
    <footer class="bg-slate-900 border-t border-slate-800 text-center py-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sanandem Research. Open Data for Better Medicine.</p>
        <p class="mt-2 text-xs text-gray-600">
            <strong>Disclaimer:</strong> This platform is for research purposes only. Always consult healthcare professionals for medical advice. 
            <a href="/disclaimer" class="underline hover:text-gray-400">Full Disclaimer</a>
        </p>
    </footer>
</div>

<style>
    /* Global styles for scrollbar */
    :global(::-webkit-scrollbar) {
        width: 8px;
    }
    :global(::-webkit-scrollbar-track) {
        background: #0f172a;
    }
    :global(::-webkit-scrollbar-thumb) {
        background: #334155;
        border-radius: 4px;
    }
    :global(::-webkit-scrollbar-thumb:hover) {
        background: #475569;
    }
</style>
