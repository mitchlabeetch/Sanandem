<script lang="ts">
    import { enhance } from '$app/forms';
    import { Label, Input, Button, Helper, Alert } from 'flowbite-svelte';
    import { UserCircleSolid, LockSolid } from 'flowbite-svelte-icons';

    let { form } = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6" method="POST" use:enhance>
                {#if form?.message}
                    <Alert color="red" class="mb-4">
                        <span class="font-medium">Error!</span> {form.message}
                    </Alert>
                {/if}
                <div>
                    <Label for="username" class="mb-2">Username</Label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserCircleSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input id="username" name="username" class="pl-10" placeholder="admin" required />
                    </div>
                </div>
                <div>
                    <Label for="password" class="mb-2">Password</Label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <LockSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input type="password" id="password" name="password" class="pl-10" placeholder="••••••••" required />
                    </div>
                </div>
                <Button type="submit" class="w-full">Sign in</Button>
            </form>
        </div>
    </div>
</div>
