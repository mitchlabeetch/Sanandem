<script lang="ts">
    let {
        text,
        position = 'top',
        children
    }: {
        text: string;
        position?: 'top' | 'bottom' | 'left' | 'right';
        children: any;
    } = $props();
    
    let showTooltip = $state(false);
    let tooltipElement: HTMLDivElement;
    
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };
    
    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
    };
</script>

<div class="relative inline-block">
    <div
        onmouseenter={() => showTooltip = true}
        onmouseleave={() => showTooltip = false}
        onfocus={() => showTooltip = true}
        onblur={() => showTooltip = false}
    >
        {@render children()}
    </div>
    
    {#if showTooltip}
        <div
            bind:this={tooltipElement}
            role="tooltip"
            class="absolute {positionClasses[position]} z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-scale-in"
        >
            {text}
            <div class="absolute {arrowClasses[position]} w-0 h-0 border-4"></div>
        </div>
    {/if}
</div>
