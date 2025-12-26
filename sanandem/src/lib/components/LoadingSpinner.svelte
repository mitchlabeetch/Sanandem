<script lang="ts">
    let {
        size = 'md',
        color = 'blue'
    }: {
        size?: 'sm' | 'md' | 'lg' | 'xl';
        color?: 'blue' | 'purple' | 'green' | 'white';
    } = $props();
    
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };
    
    const colorClasses = {
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        green: 'border-green-500',
        white: 'border-white'
    };
</script>

<div class="flex items-center justify-center">
    <div class="{sizeClasses[size]} {colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin"></div>
</div>
