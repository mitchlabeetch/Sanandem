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
    <footer class="bg-slate-900 border-t border-slate-800 text-center py-12 text-gray-500 text-sm relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900/90 pointer-events-none"></div>
        <div class="relative z-10 container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                <div class="text-left">
                    <div class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        Sanandem
                    </div>
                    <p class="text-gray-400 text-sm">Open Data for Better Medicine</p>
                </div>
                
                <div class="flex gap-8 text-sm">
                    <a href="/about" class="text-gray-400 hover:text-blue-400 transition-colors">About</a>
                    <a href="/research" class="text-gray-400 hover:text-blue-400 transition-colors">Research</a>
                    <a href="/disclaimer" class="text-gray-400 hover:text-blue-400 transition-colors">Disclaimer</a>
                </div>
            </div>
            
            <div class="border-t border-slate-800 pt-6">
                <p>© {new Date().getFullYear()} Sanandem Research. Open Data for Better Medicine.</p>
                <p class="mt-2 text-xs text-gray-600">
                    <strong>Disclaimer:</strong> This platform is for research purposes only. Always consult healthcare professionals for medical advice. 
                    <a href="/disclaimer" class="underline hover:text-gray-400 transition-colors">Full Disclaimer</a>
                </p>
            </div>
        </div>
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
