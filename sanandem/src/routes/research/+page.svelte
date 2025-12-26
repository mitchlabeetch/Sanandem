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

<svelte:head>
    <title>Research & Literature - Sanandem</title>
    <meta name="description" content="Research papers, feminist literature, and studies on medication disparities and healthcare inequality." />
</svelte:head>

<div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <section class="py-12 px-4 bg-slate-800/50">
        <div class="container mx-auto max-w-6xl">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Research & Literature</h1>
            <p class="text-xl text-gray-300 mb-6">
                Explore the academic research, feminist scholarship, and studies that inform Sanandem's mission to advance equality in medicine.
            </p>
            <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p class="text-blue-200 text-sm">
                    <strong>Note:</strong> The papers listed below are examples. This platform provides open access to aggregated, anonymized medication experience data for legitimate research purposes.
                </p>
            </div>
        </div>
    </section>

    <!-- Key Literature Section -->
    <section class="py-12 px-4">
        <div class="container mx-auto max-w-6xl">
            <h2 class="text-3xl font-bold text-white mb-6">Essential Reading on Healthcare Disparities</h2>
            
            <div class="grid md:grid-cols-2 gap-6 mb-12">
                <!-- Feminist & Social Justice Books -->
                <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 class="text-2xl font-bold text-purple-300 mb-4">📚 Feminist & Social Justice Literature</h3>
                    <div class="space-y-4 text-gray-300">
                        <div>
                            <strong class="text-white">Invisible Women</strong> by Caroline Criado Perez
                            <p class="text-sm text-gray-400">Data bias in a world designed for men - including extensive coverage of medical research gaps</p>
                        </div>
                        <div>
                            <strong class="text-white">Doing Harm</strong> by Maya Dusenbery
                            <p class="text-sm text-gray-400">How bad medicine and lazy science leave women dismissed, misdiagnosed, and sick</p>
                        </div>
                        <div>
                            <strong class="text-white">The Pain Gap</strong> by Anushay Hossain
                            <p class="text-sm text-gray-400">How sexism and racism affect women's health</p>
                        </div>
                        <div>
                            <strong class="text-white">Medical Apartheid</strong> by Harriet Washington
                            <p class="text-sm text-gray-400">The dark history of medical experimentation on Black Americans from colonial times to present</p>
                        </div>
                        <div>
                            <strong class="text-white">Data Feminism</strong> by Catherine D'Ignazio & Lauren Klein
                            <p class="text-sm text-gray-400">Examining power and justice in data science</p>
                        </div>
                    </div>
                </div>

                <!-- Academic Research -->
                <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 class="text-2xl font-bold text-blue-300 mb-4">🔬 Key Academic Research</h3>
                    <div class="space-y-4 text-gray-300">
                        <div>
                            <strong class="text-white">"Sex and gender differences in pharmacology"</strong>
                            <p class="text-sm text-gray-400">British Journal of Pharmacology (2020) - Comprehensive review of pharmacological differences</p>
                        </div>
                        <div>
                            <strong class="text-white">"Adverse drug reactions: an analysis by sex and age"</strong>
                            <p class="text-sm text-gray-400">Pharmacoepidemiology and Drug Safety - Women 1.5-1.7x more likely to experience ADRs</p>
                        </div>
                        <div>
                            <strong class="text-white">"Women's health and clinical trials"</strong>
                            <p class="text-sm text-gray-400">Journal of Internal Medicine - Analysis of representation gaps in research</p>
                        </div>
                        <div>
                            <strong class="text-white">"Racial and ethnic disparities in medication safety"</strong>
                            <p class="text-sm text-gray-400">American Journal of Public Health - Examining intersectional health inequities</p>
                        </div>
                        <div>
                            <strong class="text-white">"Racial bias in pain assessment and treatment"</strong>
                            <p class="text-sm text-gray-400">PNAS (2016) - Hoffman et al. on false beliefs about biological differences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Recent Research Papers -->
    <section class="py-12 px-4 bg-slate-800/50">
        <div class="container mx-auto max-w-6xl">
            <h2 class="text-3xl font-bold text-white mb-6">Sample Research Papers Using Similar Data</h2>
            <p class="text-gray-400 mb-8">
                Examples of how aggregated medication experience data can advance medical research and understanding.
            </p>

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
</section>

<!-- Resources Section -->
<section class="py-12 px-4">
    <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-white mb-6">Additional Resources</h2>
        
        <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 class="text-xl font-bold text-white mb-3">📊 Reports & Guidelines</h3>
                <ul class="text-gray-300 space-y-2 text-sm">
                    <li>• FDA Action Plan on Demographic Subgroup Data (2014)</li>
                    <li>• NIH Policy on Sex as Biological Variable (2015)</li>
                    <li>• IOM: Women's Health Research Progress & Pitfalls (2010)</li>
                </ul>
            </div>

            <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 class="text-xl font-bold text-white mb-3">🔗 Organizations</h3>
                <ul class="text-gray-300 space-y-2 text-sm">
                    <li>• Society for Women's Health Research</li>
                    <li>• Office of Research on Women's Health (NIH)</li>
                    <li>• Black Women's Health Imperative</li>
                </ul>
            </div>

            <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 class="text-xl font-bold text-white mb-3">💡 Learn More</h3>
                <ul class="text-gray-300 space-y-2 text-sm">
                    <li>• <a href="/about" class="text-blue-400 hover:underline">About Sanandem</a></li>
                    <li>• <a href="/disclaimer" class="text-blue-400 hover:underline">Medical Disclaimer</a></li>
                    <li>• <a href="https://github.com/mitchlabeetch/Sanandem" class="text-blue-400 hover:underline" target="_blank" rel="noopener">GitHub Repository</a></li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="py-16 px-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
    <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Contribute to the Research</h2>
        <p class="text-lg text-gray-300 mb-8">
            Share your anonymized medication experiences to help close the gap in medical research.
        </p>
        <a href="/report" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Submit a Report
        </a>
        <p class="text-sm text-gray-500 mt-4">
            <strong>Remember:</strong> This platform is for research only. Always consult healthcare professionals for medical advice.
        </p>
    </div>
</section>
</div>
