<script lang="ts">
    import {
        Card, Button, Badge, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell,
        Search, Dropdown, DropdownItem, Checkbox
    } from 'flowbite-svelte';
    import { DotsVerticalOutline, UserAddSolid, TrashBinSolid, EditSolid } from 'flowbite-svelte-icons';

    // Mock Data
    const users = [
        { id: 1, name: 'Neil Sims', email: 'neil.sims@flowbite.com', position: 'Front-end Developer', status: 'Active' },
        { id: 2, name: 'Bonnie Green', email: 'bonnie@flowbite.com', position: 'Designer', status: 'Active' },
        { id: 3, name: 'Michael Gough', email: 'michael@flowbite.com', position: 'SEO Specialist', status: 'Inactive' },
        { id: 4, name: 'Thomas Lean', email: 'thomas@flowbite.com', position: 'UI/UX Engineer', status: 'Active' },
        { id: 5, name: 'Jese Leos', email: 'jese@flowbite.com', position: 'DevOps', status: 'Active' },
    ];
</script>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">All Users</h1>
        <div class="flex items-center gap-2 w-full sm:w-auto">
            <Search class="w-full sm:w-64" placeholder="Search for users" />
            <Button color="blue">
                <UserAddSolid class="w-4 h-4 mr-2" />
                Add user
            </Button>
        </div>
    </div>

    <Card size="xl" padding="none" class="overflow-hidden">
        <Table hoverable={true}>
            <TableHead class="bg-gray-50 dark:bg-gray-700">
                <TableHeadCell class="p-4"><Checkbox /></TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Position</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each users as user}
                    <TableBodyRow class="bg-white dark:bg-gray-800 dark:border-gray-700">
                        <TableBodyCell class="p-4"><Checkbox /></TableBodyCell>
                        <TableBodyCell class="flex items-center space-x-6 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <div class="text-base font-semibold">{user.name}</div>
                            <div class="font-normal text-gray-500">{user.email}</div>
                        </TableBodyCell>
                        <TableBodyCell>{user.position}</TableBodyCell>
                        <TableBodyCell>
                            {#if user.status === 'Active'}
                                <Badge color="green">Active</Badge>
                            {:else}
                                <Badge color="red">Inactive</Badge>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            <Button color="light" size="xs" class="!p-2"><DotsVerticalOutline class="w-5 h-5"/></Button>
                            <Dropdown class="w-44 text-sm">
                                <DropdownItem class="flex items-center gap-2"><EditSolid class="w-4 h-4" /> Edit user</DropdownItem>
                                <DropdownItem class="flex items-center gap-2 text-red-600"><TrashBinSolid class="w-4 h-4" /> Delete user</DropdownItem>
                            </Dropdown>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </Card>
</div>
