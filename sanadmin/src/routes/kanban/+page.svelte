<script lang="ts">
    import { Card, Button, Badge } from 'flowbite-svelte';
    import { PlusOutline } from 'flowbite-svelte-icons';

    let tasks = [
        { id: 1, title: 'Review Reports', status: 'To Do', priority: 'High' },
        { id: 2, title: 'Update Privacy Policy', status: 'In Progress', priority: 'Medium' },
        { id: 3, title: 'Database Backup', status: 'Done', priority: 'Low' },
        { id: 4, title: 'User Feedback Analysis', status: 'To Do', priority: 'Medium' },
        { id: 5, title: 'Fix Login Bug', status: 'In Progress', priority: 'High' },
    ];

    const columns = ['To Do', 'In Progress', 'Done'];

    function getBadgeColor(priority: string) {
        switch (priority) {
            case 'High': return 'red';
            case 'Medium': return 'yellow';
            case 'Low': return 'green';
            default: return 'blue';
        }
    }
</script>

<div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Project Board</h1>
        <Button color="blue">
            <PlusOutline class="w-4 h-4 mr-2" />
            Add Task
        </Button>
    </div>

    <div class="flex overflow-x-auto gap-6 pb-4 h-full">
        {#each columns as column}
            <div class="min-w-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                <h2 class="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex justify-between items-center">
                    {column}
                    <span class="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                        {tasks.filter(t => t.status === column).length}
                    </span>
                </h2>

                <div class="space-y-3 flex-1 overflow-y-auto">
                    {#each tasks.filter(t => t.status === column) as task}
                        <Card class="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-700">
                            <h3 class="font-medium text-gray-900 dark:text-white mb-2">{task.title}</h3>
                            <div class="flex justify-between items-center mt-2">
                                <Badge color={getBadgeColor(task.priority)}>{task.priority}</Badge>
                                <span class="text-xs text-gray-500 dark:text-gray-400">#task-{task.id}</span>
                            </div>
                        </Card>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
