<script lang="ts">
    import '../app.css'; // Ensure Tailwind is loaded
    import { page } from '$app/stores';
    import {
        Sidebar, SidebarGroup, SidebarItem, SidebarWrapper,
        Navbar, NavBrand, NavHamburger, NavUl, NavLi
    } from 'flowbite-svelte';
    import {
        ChartPieSolid,
        GridSolid,
        UserSolid,
        ArrowRightToBracketOutline
    } from 'flowbite-svelte-icons';

    let { children } = $props();
    let spanClass = 'flex-1 ml-3 whitespace-nowrap';
</script>

<div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Navbar -->
    <Navbar fluid class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 fixed z-30 w-full top-0 left-0">
        <NavBrand href="/">
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-4">
                Sanadmin
            </span>
        </NavBrand>
        <div class="flex md:order-2">
            <NavHamburger />
        </div>
    </Navbar>

    <!-- Sidebar -->
    <Sidebar class="fixed top-0 left-0 z-20 w-64 h-full pt-16 transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-200 dark:border-gray-700" aria-label="Sidebar">
        <SidebarWrapper class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <SidebarGroup>
                <SidebarItem label="Dashboard" href="/dashboard" active={$page.url.pathname === '/dashboard'}>
                    {#snippet icon()}
                        <ChartPieSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    {/snippet}
                </SidebarItem>
                <SidebarItem label="Users" href="/users" active={$page.url.pathname === '/users'}>
                    {#snippet icon()}
                        <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    {/snippet}
                </SidebarItem>
                <SidebarItem label="Kanban" href="/kanban" active={$page.url.pathname === '/kanban'}>
                    {#snippet icon()}
                        <GridSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    {/snippet}
                </SidebarItem>
                 <SidebarItem label="Sign In" href="/login">
                    {#snippet icon()}
                        <ArrowRightToBracketOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    {/snippet}
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>

    <!-- Main Content -->
    <main class="p-4 sm:ml-64 pt-20 h-full">
        {@render children()}
    </main>
</div>
