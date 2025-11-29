<script>
  import { Toggle, Button, Dialog } from 'svelte-ux';

  let { open = $bindable(false) } = $props();

  let dense = $state(false);
  let dark = $state(false);
</script>

{#if open}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onclick={() => open = false}>
  <div class="w-[300px] rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" onclick={(e) => e.stopPropagation()}>
    <h2 class="text-xl font-bold mb-4">View Settings</h2>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Dark Mode</span>
        <Toggle bind:checked={dark} />
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Dense Data</span>
        <Toggle bind:checked={dense} />
      </div>

       <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Show Animations</span>
        <Toggle checked={true} />
      </div>
    </div>

    <div class="mt-8 flex justify-end">
        <Button variant="fill" color="primary" onclick={() => open = false}>Done</Button>
    </div>
  </div>
</div>
{/if}
