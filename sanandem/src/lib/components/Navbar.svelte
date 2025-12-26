<script lang="ts">
    import { page } from '$app/stores';
    import { Menu, X } from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    let isOpen = $state(false);
</script>

<nav class="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 fixed w-full top-0 z-50 transition-all duration-300 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <a href="/" class="flex-shrink-0 text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition-all duration-300" onclick={() => isOpen = false}>
                    Sanandem
                </a>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="/" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            Home
                        </a>
                        <a href="/about" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/about' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            About
                        </a>
                        <a href="/dashboard" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/dashboard' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            Dashboard
                        </a>
                        <a href="/visualizations" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/visualizations' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            Visualizations
                        </a>
                        <a href="/data" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/data' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            Download Data
                        </a>
                        <a href="/research" class="text-gray-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 {$page.url.pathname === '/research' ? 'bg-slate-800 text-white shadow-lg' : ''}">
                            Research
                        </a>
                    </div>
                </div>
            </div>
            <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                    <a href="/report" class="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105 relative overflow-hidden">
                        <span class="relative z-10">Submit Data</span>
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </a>
                </div>
            </div>
            <div class="-mr-2 flex md:hidden">
                <!-- Mobile menu button -->
                <button
                    onclick={() => isOpen = !isOpen}
                    type="button"
                    class="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-all duration-200"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                >
                    <span class="sr-only">Open main menu</span>
                    {#if isOpen}
                        <X class="block h-6 w-6" />
                    {:else}
                        <Menu class="block h-6 w-6" />
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    {#if isOpen}
        <div class="md:hidden bg-slate-800/95 backdrop-blur-lg border-b border-slate-700 shadow-2xl" id="mobile-menu" transition:slide>
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/' ? 'bg-slate-900 text-white shadow-lg' : ''}">Home</a>
                <a href="/about" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/about' ? 'bg-slate-900 text-white shadow-lg' : ''}">About</a>
                <a href="/dashboard" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/dashboard' ? 'bg-slate-900 text-white shadow-lg' : ''}">Dashboard</a>
                <a href="/visualizations" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/visualizations' ? 'bg-slate-900 text-white shadow-lg' : ''}">Visualizations</a>
                <a href="/data" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/data' ? 'bg-slate-900 text-white shadow-lg' : ''}">Download Data</a>
                 <a href="/research" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 {$page.url.pathname === '/research' ? 'bg-slate-900 text-white shadow-lg' : ''}">Research</a>
            </div>
            <div class="pt-4 pb-4 border-t border-slate-700">
                <div class="flex items-center px-5">
                    <a href="/report" onclick={() => isOpen = false} class="group w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium shadow-lg transition-all duration-200 hover:shadow-blue-500/50 relative overflow-hidden">
                        <span class="relative z-10">Submit Data</span>
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </a>
                </div>
            </div>
        </div>
    {/if}
</nav>

<div class="pt-16">
    <!-- Spacer for fixed navbar -->
</div>
