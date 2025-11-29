<script lang="ts">
  import { page } from '$app/stores';
  import { clsx } from 'clsx';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/visualize', label: 'Visualize' },
    { href: '/research', label: 'Research' },
  ];
</script>

<header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/60">
  <div class="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
    <div class="mr-4 flex w-full justify-between items-center">
      <div class="flex items-center">
        <a class="mr-6 flex items-center space-x-2" href="/">
          <span class="hidden font-bold sm:inline-block text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Sanandem</span>
        </a>
        <nav class="flex items-center space-x-6 text-sm font-medium">
          {#each links as link}
            <a
              href={link.href}
              class={clsx(
                "transition-colors hover:text-blue-600",
                $page.url.pathname === link.href ? "text-blue-600 font-bold" : "text-gray-600 dark:text-gray-400"
              )}
            >
              {link.label}
            </a>
          {/each}
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Placeholder for Bits UI Dropdown or Actions -->
        <button class="text-sm font-medium text-gray-500 hover:text-gray-900">Sign In</button>
      </div>
    </div>
  </div>
</header>
