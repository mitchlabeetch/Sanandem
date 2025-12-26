<script lang="ts">
    import { fade } from 'svelte/transition';
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();
    
    let submitted = $state(false);
    let loading = $state(false);
    let currentStep = $state(1);
    let severityValue = $state(5);

    // Watch for successful submission
    $effect(() => {
        if (form?.success) {
            submitted = true;
            loading = false;
        } else if (form?.error) {
            loading = false;
        }
    });

    function nextStep() {
        if (currentStep < 3) currentStep++;
    }

    function prevStep() {
        if (currentStep > 1) currentStep--;
    }


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
            <form method="POST" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    loading = false;
                };
            }} class="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6" transition:fade>
                {#if form?.error}
                    <div class="bg-red-900/30 border border-red-500 rounded-lg p-4">
                        <p class="text-red-200 text-center">{form.error}</p>
                    </div>
                {/if}

                <!-- Progress Indicator -->
                <div class="flex items-center justify-center space-x-2 mb-6">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400'}">1</div>
                        <span class="text-xs ml-2 text-gray-400">Medication</span>
                    </div>
                    <div class="w-12 h-0.5 {currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-700'}"></div>
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400'}">2</div>
                        <span class="text-xs ml-2 text-gray-400">Effects</span>
                    </div>
                    <div class="w-12 h-0.5 {currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-700'}"></div>
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400'}">3</div>
                        <span class="text-xs ml-2 text-gray-400">Demographics</span>
                    </div>
                </div>

                <!-- Step 1: Medication Information -->
                {#if currentStep === 1}
                    <div class="space-y-6" in:fade>
                        <div>
                            <label for="medicationName" class="block text-sm font-medium text-gray-400 mb-2">Medication Name *</label>
                            <input type="text" id="medicationName" name="medicationName" required value={form?.medicationName || ''} class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. Aspirin, Ibuprofen">
                        </div>

                        <div>
                            <label for="medicationDosage" class="block text-sm font-medium text-gray-400 mb-2">Dosage (Optional)</label>
                            <input type="text" id="medicationDosage" name="medicationDosage" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. 500mg, 10ml">
                        </div>

                        <div>
                            <label for="usageDuration" class="block text-sm font-medium text-gray-400 mb-2">How long have you been taking this? (Optional)</label>
                            <input type="text" id="usageDuration" name="usageDuration" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. 2 weeks, 3 months">
                        </div>

                        <button type="button" onclick={nextStep} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                            Next: Effects →
                        </button>
                    </div>
                {/if}

                <!-- Step 2: Effects Information -->
                {#if currentStep === 2}
                    <div class="space-y-6" in:fade>
                        <div>
                            <label for="sideEffects" class="block text-sm font-medium text-gray-400 mb-2">Side Effects / Symptoms *</label>
                            <textarea id="sideEffects" name="sideEffects" rows="4" required value={form?.sideEffectsRaw || ''} class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Separate multiple effects with commas (e.g. headache, nausea, dizziness)"></textarea>
                            <p class="text-xs text-gray-500 mt-1">Describe any negative effects or symptoms experienced</p>
                        </div>

                        <div>
                            <label for="positiveEffects" class="block text-sm font-medium text-gray-400 mb-2">Positive Effects (Optional)</label>
                            <textarea id="positiveEffects" name="positiveEffects" rows="3" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Separate with commas (e.g. pain relief, improved sleep)"></textarea>
                            <p class="text-xs text-gray-500 mt-1">Did the medication help with your condition?</p>
                        </div>

                        <div>
                            <label for="severity" class="block text-sm font-medium text-gray-400 mb-2">Side Effect Severity: {severityValue}/10 *</label>
                            <input type="range" id="severity" name="severity" min="1" max="10" bind:value={severityValue} value={form?.severity || 5} class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Mild (1)</span>
                                <span>Moderate (5)</span>
                                <span>Severe (10)</span>
                            </div>
                        </div>

                        <div>
                            <label for="durationOfEffect" class="block text-sm font-medium text-gray-400 mb-2">Duration of Effects (Optional)</label>
                            <input type="text" id="durationOfEffect" name="durationOfEffect" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. 2 hours, ongoing">
                        </div>

                        <div class="flex gap-4">
                            <button type="button" onclick={prevStep} class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                ← Back
                            </button>
                            <button type="button" onclick={nextStep} class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                Next: Demographics →
                            </button>
                        </div>
                    </div>
                {/if}

                <!-- Step 3: Demographics (All Optional) -->
                {#if currentStep === 3}
                    <div class="space-y-6" in:fade>
                        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                            <p class="text-sm text-blue-200">
                                <strong>Optional:</strong> Providing demographic information helps researchers understand how medications affect different populations. All fields are optional and will remain anonymous.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label for="age" class="block text-sm font-medium text-gray-400 mb-2">Age (Optional)</label>
                                <input type="number" id="age" name="age" min="0" max="120" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. 35">
                            </div>
                            <div>
                                <label for="gender" class="block text-sm font-medium text-gray-400 mb-2">Gender (Optional)</label>
                                <select id="gender" name="gender" class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                    <option value="">Prefer not to say</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button type="button" onclick={prevStep} class="w-full mb-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                ← Back to Effects
                            </button>
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
                    </div>
                {/if}

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
