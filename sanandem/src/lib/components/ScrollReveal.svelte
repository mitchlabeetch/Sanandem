<script lang="ts">
    import { onMount } from 'svelte';
    
    let { 
        children,
        delay = 0,
        class: className = ''
    }: {
        children: any;
        delay?: number;
        class?: string;
    } = $props();
    
    let element: HTMLDivElement;
    let isVisible = $state(false);
    
    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            isVisible = true;
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        if (element) {
            observer.observe(element);
        }
        
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    });
</script>

<div 
    bind:this={element}
    class="{className} transition-all duration-700 ease-out {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
>
    {@render children()}
</div>
