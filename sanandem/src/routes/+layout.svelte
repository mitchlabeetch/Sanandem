<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    let { children } = $props();
</script>

<div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
    <Navbar />
    <main>
        {@render children()}
    </main>
    <footer class="bg-slate-900 border-t border-slate-800 text-center py-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sanandem Research. Open Data for Better Medicine.</p>
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
