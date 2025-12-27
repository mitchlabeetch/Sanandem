<script>
  import { Toggle, Button } from 'svelte-ux';
  import { isLowPerformanceMode, isDarkMode, isDenseMode } from '$lib/stores/settings';

  let { open = $bindable(false) } = $props();

  // Local state for the toggle, synced with store
  let animations = $state(!$isLowPerformanceMode);

  // Sync back to store
  $effect(() => {
      $isLowPerformanceMode = !animations;
  });
</script>

{#if open}
<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    role="button"
    tabindex="0"
    onclick={() => open = false}
    onkeydown={(e) => { if (e.key === 'Escape') open = false; }}
>
  <div
    class="w-[300px] rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 cursor-default"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
  >
    <h2 class="text-xl font-bold mb-4">View Settings</h2>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Dark Mode</span>
        <Toggle bind:on={$isDarkMode} />
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Dense Data</span>
        <Toggle bind:on={$isDenseMode} />
      </div>

       <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Show Animations</span>
        <Toggle bind:on={animations} />
      </div>
    </div>

    <div class="mt-8 flex justify-end">
        <Button variant="fill" color="primary" onclick={() => open = false}>Done</Button>
    </div>
  </div>
</div>
{/if}
