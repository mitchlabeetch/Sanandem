<script lang="ts">
    import { Button, Card, Heading, Alert } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import { DatabaseSolid, RefreshOutline } from 'flowbite-svelte-icons';

    let { form } = $props();

    $effect(() => {
        if (form?.download && form?.data) {
            const blob = new Blob([form.data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = form.filename || 'backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
</script>

<div class="p-6 space-y-6">
    <Heading tag="h2">System Settings</Heading>

    {#if form?.success}
        <Alert color="green">Operation completed successfully.</Alert>
    {/if}
    {#if form?.error}
        <Alert color="red">{form.error}</Alert>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <div class="flex flex-col items-center text-center">
                <DatabaseSolid class="w-12 h-12 text-gray-500 mb-4" />
                <h3 class="text-xl font-bold mb-2">Data Backup</h3>
                <p class="text-gray-500 mb-6">Download a full JSON dump of all medication reports.</p>
                <form method="POST" action="?/backup" use:enhance>
                    <Button type="submit" color="blue">Download Backup</Button>
                </form>
            </div>
        </Card>

        <Card>
            <div class="flex flex-col items-center text-center">
                <RefreshOutline class="w-12 h-12 text-gray-500 mb-4" />
                <h3 class="text-xl font-bold mb-2">Clear Cache</h3>
                <p class="text-gray-500 mb-6">Invalidate all cached statistics. Used if data seems stale.</p>
                <form method="POST" action="?/clearCache" use:enhance>
                    <Button type="submit" color="red">Clear Cache</Button>
                </form>
            </div>
        </Card>
    </div>
</div>
