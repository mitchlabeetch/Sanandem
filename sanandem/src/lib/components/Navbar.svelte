<script lang="ts">
    import { page } from '$app/stores';
    import { Menu, X } from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    let isOpen = $state(false);
</script>

<nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 fixed w-full top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <a href="/" class="flex-shrink-0 text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" onclick={() => isOpen = false}>
                    Sanandem
                </a>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="/" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/' ? 'bg-slate-800 text-white' : ''}">
                            Home
                        </a>
                        <a href="/about" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/about' ? 'bg-slate-800 text-white' : ''}">
                            About
                        </a>
                        <a href="/dashboard" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/dashboard' ? 'bg-slate-800 text-white' : ''}">
                            Dashboard
                        </a>
                        <a href="/visualizations" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/visualizations' ? 'bg-slate-800 text-white' : ''}">
                            Visualizations
                        </a>
                        <a href="/data" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/data' ? 'bg-slate-800 text-white' : ''}">
                            Download Data
                        </a>
                        <a href="/research" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/research' ? 'bg-slate-800 text-white' : ''}">
                            Research
                        </a>
                    </div>
                </div>
            </div>
            <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                    <a href="/report" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out shadow-lg hover:shadow-blue-500/50">
                        Submit Data
                    </a>
                </div>
            </div>
            <div class="-mr-2 flex md:hidden">
                <!-- Mobile menu button -->
                <button
                    onclick={() => isOpen = !isOpen}
                    type="button"
                    class="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
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
        <div class="md:hidden bg-slate-800 border-b border-slate-700 shadow-xl" id="mobile-menu" transition:slide>
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/' ? 'bg-slate-900 text-white' : ''}">Home</a>
                <a href="/about" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/about' ? 'bg-slate-900 text-white' : ''}">About</a>
                <a href="/dashboard" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/dashboard' ? 'bg-slate-900 text-white' : ''}">Dashboard</a>
                <a href="/visualizations" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/visualizations' ? 'bg-slate-900 text-white' : ''}">Visualizations</a>
                <a href="/data" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/data' ? 'bg-slate-900 text-white' : ''}">Download Data</a>
                 <a href="/research" onclick={() => isOpen = false} class="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === '/research' ? 'bg-slate-900 text-white' : ''}">Research</a>
            </div>
            <div class="pt-4 pb-4 border-t border-slate-700">
                <div class="flex items-center px-5">
                    <a href="/report" onclick={() => isOpen = false} class="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium shadow-md">
                        Submit Data
                    </a>
                </div>
            </div>
        </div>
    {/if}
</nav>

<div class="pt-16">
    <!-- Spacer for fixed navbar -->
</div>
