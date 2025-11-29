<script lang="ts">
  import AnimatedBeam from '$lib/components/magic/AnimatedBeam.svelte';
  import { Motion } from 'svelte-motion';
  import { AnimatedHeadline } from 'svelte-animated-headline';
</script>

<div class="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[80vh]">
    <div class="text-center space-y-4 mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
            The Missing Data in
            <br/>
            <span class="text-foreground text-gray-900 dark:text-gray-100">Medicine</span>
        </h1>
        <div class="text-2xl text-muted-foreground text-gray-500">
             Understanding <AnimatedHeadline words={['Adverse Reactions', 'Sex Differences', 'Pharmacokinetics']} />
        </div>
        <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-gray-600">
            Visualize and analyze the sex data gap in pharmacotherapy.
        </p>

        <div class="flex gap-4 justify-center pt-4">
             <a href="/visualize" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2">
                Start Exploring
             </a>
              <a href="/research" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 h-9 px-4 py-2 text-gray-900">
                Read Papers
             </a>
        </div>
    </div>

    <Motion initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div class="w-full max-w-4xl flex justify-center">
            <AnimatedBeam />
        </div>
    </Motion>
</div>
