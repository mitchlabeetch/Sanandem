<script lang="ts">
    import { fade } from 'svelte/transition';

    let submitted = $state(false);
    let loading = $state(false);

    function handleSubmit(e: Event) {
        e.preventDefault();
        loading = true;
        // Mock submission
        setTimeout(() => {
            loading = false;
            submitted = true;
        }, 1500);
    }
</script>

<div class="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
     <!-- Background Effect -->
     <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div class="absolute top-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-3xl mx-auto relative z-10">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-white mb-4">Submit a Report</h1>
            <p class="text-xl text-gray-400">Contribute to the global safety database anonymously.</p>
        </div>

        {#if submitted}
            <div in:fade class="bg-slate-800/50 backdrop-blur-md border border-green-500/30 rounded-2xl p-12 text-center shadow-2xl">
                <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="text-3xl font-bold text-white mb-4">Report Submitted!</h2>
                <p class="text-gray-300 mb-8">Thank you for your contribution to medical science. Your report has been anonymized and added to the queue.</p>
                <button onclick={() => submitted = false} class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                    Submit Another
                </button>
            </div>
        {:else}
            <form onsubmit={handleSubmit} class="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6" transition:fade>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label for="medication" class="block text-sm font-medium text-gray-400 mb-2">Medication Name</label>
                        <input type="text" id="medication" required class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. Aspirin">
                    </div>
                    <div>
                        <label for="age" class="block text-sm font-medium text-gray-400 mb-2">Patient Age</label>
                        <input type="number" id="age" required min="0" max="120" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. 35">
                    </div>
                </div>

                <div>
                    <label for="symptoms" class="block text-sm font-medium text-gray-400 mb-2">Side Effects / Symptoms</label>
                    <textarea id="symptoms" rows="4" required class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Describe the reaction..."></textarea>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label for="severity" class="block text-sm font-medium text-gray-400 mb-2">Severity (1-10)</label>
                        <input type="range" id="severity" min="1" max="10" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer">
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Mild</span>
                            <span>Severe</span>
                        </div>
                    </div>
                    <div>
                        <label for="gender" class="block text-sm font-medium text-gray-400 mb-2">Gender (Optional)</label>
                        <select id="gender" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" disabled={loading} class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        {:else}
                            Submit Report
                        {/if}
                    </button>
                </div>

                <p class="text-xs text-center text-gray-500 mt-4">
                    By submitting, you agree to our Open Data Policy. No personal identifiable information is stored.
                </p>
                <div class="bg-red-900/30 border border-red-500 rounded-lg p-4 mt-4">
                    <p class="text-xs text-center text-red-200">
                        <strong>⚠️ Remember:</strong> This platform is for research only. Always consult healthcare professionals for medical advice. 
                        <a href="/disclaimer" class="underline hover:text-red-100">Read full disclaimer</a>
                    </p>
                </div>
            </form>
        {/if}
    </div>
</div>
