<script lang="ts">
    import { AnimatedHeadline } from 'svelte-animated-headline';
    import { isLowPerformanceMode } from '$lib/stores/settings';
</script>

<div class="relative overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[90dvh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <!-- Background "Magic" Effect -->
        {#if !$isLowPerformanceMode}
        <div class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse motion-reduce:animate-none"></div>
            <div class="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-bounce duration-[10000ms] motion-reduce:animate-none"></div>
        </div>
        {/if}

        <div class="relative z-10 max-w-4xl mx-auto space-y-8">
            <div class="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium backdrop-blur-md">
                ✨ Now supporting global data synchronization
            </div>

            <h1 class="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
                Sanandem <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                    Open Research
                </span>
            </h1>

            <div class="h-20 md:h-24 text-2xl md:text-4xl text-slate-400 font-light" aria-live="polite">
                <AnimatedHeadline
                    texts={[
                        'Advancing Medicine Equality',
                        'Visualize Global Health Data',
                        'Empower Medical Research',
                        'Share Anonymous Experiences',
                        'Close the Data Gap'
                    ]}
                    wait={2000}
                />
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <a href="/dashboard" class="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Explore Dashboard
                </a>
                <a href="/visualizations" class="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-700 transition-all">
                    View Visualizations
                </a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-slate-900 relative z-10">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-white mb-4">Why Sanandem Matters</h2>
                <p class="text-xl text-gray-400 max-w-3xl mx-auto">
                    For decades, medical research has suffered from systemic biases. Medications tested primarily on men are prescribed to everyone. 
                    Side effects affecting women and marginalized groups are understudied. We're working to close that gap.
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="space-y-4 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors group">
                    <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/30 transition-colors">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white">Democratic Data</h3>
                    <p class="text-gray-400 leading-relaxed">
                        Anyone can contribute. All demographics matter. Built to handle millions of records and reveal patterns in how medications affect diverse populations.
                    </p>
                </div>

                <div class="space-y-4 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors group">
                    <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/30 transition-colors">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white">Visual Insights</h3>
                    <p class="text-gray-400 leading-relaxed">
                        Utilizing D3 and ECharts for deep-dive analytics. See how medications affect different genders, ages, and demographics through interactive visualizations.
                    </p>
                </div>

                <div class="space-y-4 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-colors group">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/30 transition-colors">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white">Privacy First</h3>
                    <p class="text-gray-400 leading-relaxed">
                        We collect no personally identifiable information. All submissions are anonymized, ensuring research data is open while individuals remain completely protected.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission Section -->
    <section class="py-24 bg-slate-950 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none" aria-hidden="true"></div>
        <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold text-white mb-6 text-center">The Gender Data Gap in Medicine</h2>
                <div class="space-y-6 text-lg text-gray-300">
                    <p>
                        Until 1993, women of childbearing age were routinely <strong class="text-white">excluded from clinical drug trials</strong>. 
                        Even today, women make up less than 40% of participants in many trials, yet medications are prescribed to everyone.
                    </p>
                    <p>
                        The consequences are real: <strong class="text-white">Women are 50-70% more likely to experience adverse drug reactions</strong> than men. 
                        Between 1997-2001, 80% of drugs withdrawn from the market posed greater risks to women.
                    </p>
                    <p>
                        This isn't just about gender. Clinical trials have historically <strong class="text-white">underrepresented older adults, children, racial minorities, and LGBTQ+ populations</strong>. 
                        The result? Medications that work better for some than others.
                    </p>
                    <p class="text-xl text-blue-300 font-semibold text-center pt-6">
                        Sanandem helps close this gap by collecting diverse experiences and making patterns visible.
                    </p>
                </div>
                <div class="mt-8 text-center">
                    <a href="/research" class="text-blue-400 hover:text-blue-300 underline">Learn more about the research behind this project →</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" aria-hidden="true"></div>
        <div class="container mx-auto px-6 text-center relative z-10">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">Ready to contribute?</h2>
            <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                Join thousands of others in building the world's largest open database of medication side effects.
            </p>
            <a href="/report" class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform transition hover:scale-105">
                Submit a Report Now
            </a>
        </div>
    </section>
</div>
