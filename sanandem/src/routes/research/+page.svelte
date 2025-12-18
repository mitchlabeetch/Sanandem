<script lang="ts">
    import { papers } from '$lib/data/mock';
    import NumberFlow from '@number-flow/svelte';

    let downloads = $state(0);
    let downloading = $state(false);

    function handleDownload() {
        downloading = true;
        setTimeout(() => {
            downloading = false;
            downloads++;
        }, 1000);
    }
</script>

<div class="container mx-auto px-4 py-12 relative">
    <h1 class="text-3xl font-bold mb-8">Research Papers</h1>

    <div class="grid gap-6">
        {#each papers as paper}
            <div class="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-xl font-bold">{paper.title}</h2>
                        <p class="text-sm text-gray-500 mt-1">{paper.authors} - {paper.journal} ({paper.year})</p>
                    </div>
                    <div class="text-right">
                         <div class="text-2xl font-bold tabular-nums text-blue-600">
                            <NumberFlow value={paper.stats.citations} />
                         </div>
                         <div class="text-xs text-gray-500">Citations</div>
                    </div>
                </div>

                <p class="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {paper.abstract}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                    {#each paper.tags as tag}
                        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200">
                            {tag}
                        </span>
                    {/each}
                </div>

                <div class="mt-6">
                    <button
                        onclick={handleDownload}
                        disabled={downloading}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 h-9 px-4 py-2 text-gray-900 gap-2"
                    >
                        {#if downloading}
                            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        {/if}
                        Download PDF
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
