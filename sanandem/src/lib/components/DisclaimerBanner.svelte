<script lang="ts">
    import { X } from 'lucide-svelte';
    
    let dismissed = $state(false);
    
    function dismiss() {
        dismissed = true;
        // Store in sessionStorage so it persists during the session
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('disclaimer-dismissed', 'true');
        }
    }
    
    // Check if already dismissed in this session
    if (typeof sessionStorage !== 'undefined') {
        dismissed = sessionStorage.getItem('disclaimer-dismissed') === 'true';
    }
</script>

{#if !dismissed}
<div class="bg-red-900/90 border-t-4 border-red-500 text-white px-4 py-3 shadow-2xl sticky top-0 z-50 backdrop-blur-sm animate-slide-down" role="alert">
    <div class="container mx-auto flex items-start justify-between gap-4">
        <div class="flex-1">
            <div class="flex items-center mb-1">
                <svg class="w-5 h-5 mr-2 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span class="font-bold text-lg">Medical Disclaimer</span>
            </div>
            <p class="text-sm leading-relaxed">
                <strong>This platform is for research purposes ONLY and is NOT medical advice.</strong> 
                Always consult qualified healthcare professionals for medical decisions. Never use this data to self-diagnose, 
                start, stop, or modify any medication. In emergencies, call your local emergency services immediately. 
                <a href="/disclaimer" class="underline hover:text-red-200 font-semibold transition-colors">Read full disclaimer</a>
            </p>
        </div>
        <button 
            onclick={dismiss}
            class="flex-shrink-0 text-white hover:text-red-200 transition-all p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-800/50"
            aria-label="Dismiss disclaimer"
        >
            <X size={20} />
        </button>
    </div>
</div>
{/if}
