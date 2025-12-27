<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import {
		Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,
		Button, Label, Input, Select, Range, Card
	} from 'flowbite-svelte';
    import { Chart } from 'svelte-echarts';

	let { data } = $props();

	let genderOptions = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' },
		{ value: 'other', name: 'Other' }
	];

    let chartOptions = {
        chart: {
            height: '300px',
            maxWidth: '100%',
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            dropShadow: { enabled: false },
            toolbar: { show: false }
        },
        tooltip: { enabled: true, x: { show: false } },
        fill: {
            type: 'gradient',
            gradient: { opacityFrom: 0.55, opacityTo: 0, shade: '#1C64F2', gradientToColors: ['#1C64F2'] }
        },
        dataLabels: { enabled: false },
        stroke: { width: 6 },
        grid: { show: false, strokeDashArray: 4, padding: { left: 2, right: 2, top: 0 } },
        series: [
            { name: 'Reports', data: [10, 41, 35, 51, 49, 62, 69, 91, 148], color: '#1A56DB' }
        ],
        xaxis: {
            categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false }
    };
</script>

<div class="p-8 space-y-8">
	<h1 class="text-3xl font-bold dark:text-white">Admin Dashboard</h1>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card class="w-full max-w-none">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Report Trends</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400 mb-4">
                Weekly submission volume.
            </p>
            <Chart options={chartOptions} />
        </Card>

        <Card class="w-full max-w-none">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Add Medication Report</h2>
            <form method="POST" action="?/create" use:enhance class="space-y-4">
                <div>
                    <Label for="medicationName" class="mb-2">Medication Name</Label>
                    <Input id="medicationName" name="medicationName" placeholder="e.g. Aspirin" required />
                </div>

                <div>
                    <Label for="sideEffect" class="mb-2">Side Effect</Label>
                    <Input id="sideEffect" name="sideEffect" placeholder="e.g. Headache" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="age" class="mb-2">Age</Label>
                        <Input type="number" id="age" name="age" required />
                    </div>
                    <div>
                        <Label for="gender" class="mb-2">Gender</Label>
                        <Select id="gender" items={genderOptions} name="gender" required placeholder="Select gender" />
                    </div>
                </div>

                <div>
                    <Label for="severity" class="mb-2">Severity (1-10)</Label>
                    <Range id="severity" name="severity" min="1" max="10" value="5" />
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>Mild</span>
                        <span>Severe</span>
                    </div>
                </div>

                <Button type="submit" class="w-full">Submit Report</Button>
            </form>
        </Card>
    </div>

	<div>
		<h2 class="text-xl font-semibold mb-4 dark:text-white">Recent Reports</h2>
		<Table striped={true}>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Medication</TableHeadCell>
				<TableHeadCell>Side Effects</TableHeadCell>
				<TableHeadCell>Severity</TableHeadCell>
				<TableHeadCell>Age</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.reports.slice(0, 20) as report}
					<TableBodyRow>
						<TableBodyCell>{report.id}</TableBodyCell>
						<TableBodyCell>{report.medicationName}</TableBodyCell>
						<TableBodyCell>
							{#if Array.isArray(report.sideEffects)}
								{report.sideEffects.slice(0, 2).join(', ')}
								{#if report.sideEffects.length > 2}
									<span class="text-gray-500">+{report.sideEffects.length - 2}</span>
								{/if}
							{:else}
								{report.sideEffects || 'N/A'}
							{/if}
						</TableBodyCell>
						<TableBodyCell>{report.severity}/10</TableBodyCell>
						<TableBodyCell>{report.age || report.ageGroup || 'N/A'}</TableBodyCell>
						<TableBodyCell>{report.gender || 'N/A'}</TableBodyCell>
						<TableBodyCell>{new Date(report.createdAt).toLocaleDateString()}</TableBodyCell>
						<TableBodyCell>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={report.id} />
								<Button type="submit" size="xs" color="red">Delete</Button>
							</form>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
				{#if data.reports.length === 0}
					<TableBodyRow>
						<TableBodyCell colspan="8">
							<p class="text-center text-gray-500 py-8">No reports yet. Create one above!</p>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			</TableBody>
		</Table>
	</div>
</div>
