<script lang="ts">
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Heading, Pagination, PaginationItem } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let logs = $derived(data.logs || []);
    let currentPage = $derived(data.page || 1);

    function changePage(newPage: number) {
        const query = new URLSearchParams($page.url.searchParams);
        query.set('page', newPage.toString());
        goto(`?${query.toString()}`);
    }
</script>

<div class="p-6">
    <Heading tag="h2" class="mb-6">Audit Log</Heading>

    {#if logs.length > 0}
        <Table shadow hoverable={true}>
            <TableHead>
                <TableHeadCell>Timestamp</TableHeadCell>
                <TableHeadCell>User</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
                <TableHeadCell>Entity</TableHeadCell>
                <TableHeadCell>Details</TableHeadCell>
                <TableHeadCell>IP Address</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each logs as log}
                    <TableBodyRow>
                        <TableBodyCell>{new Date(log.createdAt).toLocaleString()}</TableBodyCell>
                        <TableBodyCell>{log.username || 'Unknown'}</TableBodyCell>
                        <TableBodyCell>
                            <span class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">
                                {log.action}
                            </span>
                        </TableBodyCell>
                        <TableBodyCell>{log.entityType} #{log.entityId}</TableBodyCell>
                        <TableBodyCell>
                            <pre class="text-xs whitespace-pre-wrap max-w-xs">{JSON.stringify(log.details, null, 2)}</pre>
                        </TableBodyCell>
                        <TableBodyCell>{log.ipAddress || '-'}</TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>

        <div class="flex justify-center mt-4">
            <div class="flex space-x-2">
                <button
                    disabled={currentPage <= 1}
                    onclick={() => changePage(currentPage - 1)}
                    class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
                    Previous
                </button>
                <span class="px-3 py-1">Page {currentPage}</span>
                <button
                    disabled={logs.length < (data.limit || 20)}
                    onclick={() => changePage(currentPage + 1)}
                    class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    {:else}
        <div class="text-center py-10 text-gray-500">
            No audit logs found.
        </div>
    {/if}
</div>
