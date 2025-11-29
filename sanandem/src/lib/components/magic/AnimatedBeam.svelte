<script lang="ts">
  import { onMount } from 'svelte';
</script>

<div class="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl">
  <div class="flex h-full w-full flex-col items-stretch justify-between gap-10">
    <div class="flex flex-row justify-between">
      <div class="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
        👤
      </div>
      <div class="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
        💊
      </div>
    </div>
    <div class="flex flex-row justify-center">
      <div class="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
        📊
      </div>
    </div>
  </div>

  <svg class="pointer-events-none absolute left-0 top-0 h-full w-full">
    <path
      d="M 60 60 Q 250 150 250 150"
      fill="none"
      stroke="url(#gradient1)"
      stroke-width="4"
      stroke-linecap="round"
      class="animate-beam"
    />
     <path
      d="M 440 60 Q 250 150 250 150"
      fill="none"
      stroke="url(#gradient2)"
      stroke-width="4"
      stroke-linecap="round"
      class="animate-beam delay-75"
    />
    <defs>
      <linearGradient id="gradient1" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop stop-color="#60A5FA" stop-opacity="0"></stop>
        <stop stop-color="#60A5FA"></stop>
        <stop offset="32.5%" stop-color="#60A5FA"></stop>
        <stop offset="100%" stop-color="#60A5FA" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient id="gradient2" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop stop-color="#C084FC" stop-opacity="0"></stop>
        <stop stop-color="#C084FC"></stop>
        <stop offset="32.5%" stop-color="#C084FC"></stop>
        <stop offset="100%" stop-color="#C084FC" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
</div>

<style>
  .animate-beam {
    stroke-dasharray: 20 100;
    animation: beam 2s linear infinite;
  }
  @keyframes beam {
    from {
        stroke-dashoffset: 200;
    }
    to {
        stroke-dashoffset: -200;
    }
  }
  .delay-75 {
    animation-delay: 0.5s;
  }
</style>
