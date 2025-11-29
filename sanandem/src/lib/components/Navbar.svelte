<script lang="ts">
    import { page } from '$app/stores';
</script>

<nav class="bg-slate-900 border-b border-slate-700 fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <a href="/" class="flex-shrink-0 text-white font-bold text-xl">
                    Sanandem
                </a>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="/" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/' ? 'bg-slate-800 text-white' : ''}">
                            Home
                        </a>
                        <a href="/dashboard" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/dashboard' ? 'bg-slate-800 text-white' : ''}">
                            Dashboard
                        </a>
                        <a href="/visualizations" class="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/visualizations' ? 'bg-slate-800 text-white' : ''}">
                            Visualizations
                        </a>
                    </div>
                </div>
            </div>
            <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out">
                        Submit Data
                    </button>
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="pt-16">
    <!-- Spacer for fixed navbar -->
</div>
