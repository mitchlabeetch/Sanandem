<script lang="ts">
    import { fade } from 'svelte/transition';
    
    let acceptedTerms = $state(false);
    let selectedFormat = $state('json');
    let selectedFilters = $state({
        gender: '',
        minSeverity: 1,
        limit: 1000
    });
    let downloading = $state(false);

    function handleDownload() {
        if (!acceptedTerms) {
            alert('Please accept the terms and conditions to download data.');
            return;
        }

        downloading = true;
        
        const params = new URLSearchParams({
            format: selectedFormat,
            limit: String(selectedFilters.limit)
        });
        
        if (selectedFilters.gender) {
            params.append('gender', selectedFilters.gender);
        }
        
        if (selectedFilters.minSeverity > 1) {
            params.append('minSeverity', String(selectedFilters.minSeverity));
        }

        window.location.href = `/api/export?${params.toString()}`;
        
        setTimeout(() => {
            downloading = false;
        }, 2000);
    }
</script>

<svelte:head>
    <title>Data Download - Sanandem</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 py-12 px-4">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-white mb-4">Open Data Access</h1>
            <p class="text-xl text-gray-400">
                Download anonymized medication side effect data for research purposes
            </p>
        </div>

        <!-- Important Notice -->
        <div class="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 mb-8">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-red-200 mb-2">⚠️ Research Use Only</h2>
                    <ul class="text-red-200 space-y-2 text-sm">
                        <li>• This data is for research purposes ONLY</li>
                        <li>• DO NOT use for self-diagnosis or treatment decisions</li>
                        <li>• Always consult qualified healthcare professionals</li>
                        <li>• Data is anonymized and crowdsourced</li>
                        <li>• Not verified by medical professionals</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Download Options -->
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8" transition:fade>
            <h2 class="text-2xl font-bold text-white mb-6">Download Options</h2>
            
            <!-- Format Selection -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-3">Data Format</label>
                <div class="flex gap-4">
                    <button 
                        type="button"
                        onclick={() => selectedFormat = 'json'}
                        class="flex-1 py-3 px-6 rounded-lg border-2 transition-all {selectedFormat === 'json' ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'}"
                    >
                        <div class="font-bold">JSON</div>
                        <div class="text-xs">Structured data with metadata</div>
                    </button>
                    <button 
                        type="button"
                        onclick={() => selectedFormat = 'csv'}
                        class="flex-1 py-3 px-6 rounded-lg border-2 transition-all {selectedFormat === 'csv' ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'}"
                    >
                        <div class="font-bold">CSV</div>
                        <div class="text-xs">Spreadsheet compatible</div>
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="space-y-6 mb-8">
                <div>
                    <label for="gender" class="block text-sm font-medium text-gray-300 mb-2">
                        Filter by Gender (Optional)
                    </label>
                    <select 
                        id="gender"
                        bind:value={selectedFilters.gender}
                        class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label for="severity" class="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Severity: {selectedFilters.minSeverity}
                    </label>
                    <input 
                        type="range"
                        id="severity"
                        min="1"
                        max="10"
                        bind:value={selectedFilters.minSeverity}
                        class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Mild (1)</span>
                        <span>Severe (10)</span>
                    </div>
                </div>

                <div>
                    <label for="limit" class="block text-sm font-medium text-gray-300 mb-2">
                        Number of Records (Max 5,000)
                    </label>
                    <input 
                        type="number"
                        id="limit"
                        min="100"
                        max="5000"
                        step="100"
                        bind:value={selectedFilters.limit}
                        class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
                <label class="flex items-start gap-3 cursor-pointer group">
                    <input 
                        type="checkbox"
                        bind:checked={acceptedTerms}
                        class="mt-1 w-5 h-5 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-blue-500 text-blue-600"
                    />
                    <span class="text-sm text-gray-300 group-hover:text-white transition-colors">
                        I understand that this data is for research purposes only and should not be used for medical advice. 
                        I will cite Sanandem as the data source in any publications or presentations.
                    </span>
                </label>
            </div>

            <!-- Download Button -->
            <button
                type="button"
                onclick={handleDownload}
                disabled={!acceptedTerms || downloading}
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
                {#if downloading}
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing Download...
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Data
                {/if}
            </button>
        </div>

        <!-- Citation Information -->
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 class="text-lg font-bold text-white mb-4">How to Cite</h3>
            <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                Sanandem Project. ({new Date().getFullYear()}). Open Medication Side Effect Database. 
                Retrieved from https://sanandem.org
            </div>
            <p class="text-sm text-gray-400 mt-4">
                For questions about the data or collaboration opportunities, please visit our 
                <a href="/about" class="text-blue-400 hover:text-blue-300 underline">About page</a>.
            </p>
        </div>
    </div>
</div>
