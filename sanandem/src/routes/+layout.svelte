<script>
    import "../app.css";
    import Header from "$lib/components/ui/Header.svelte";

    let { children } = $props();
</script>

<div class="min-h-screen bg-background font-sans text-foreground antialiased">
    <Header />
    <main class="flex-1">
        {@render children()}
    </main>
    <footer class="py-6 md:px-8 md:py-0">
        <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built for research.
            </p>
        </div>
    </footer>
</div>
