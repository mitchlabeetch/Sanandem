<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import {
		Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,
		Button, Label, Input, Select, Range, Card
	} from 'flowbite-svelte';

	let { data } = $props();

	let genderOptions = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' },
		{ value: 'other', name: 'Other' }
	];
</script>

<div class="p-8 space-y-8">
	<h1 class="text-3xl font-bold dark:text-white">Admin Dashboard</h1>

	<Card class="max-w-xl">
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

	<div>
		<h2 class="text-xl font-semibold mb-4 dark:text-white">Recent Reports</h2>
		<Table striped={true}>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Medication</TableHeadCell>
				<TableHeadCell>Side Effect</TableHeadCell>
				<TableHeadCell>Severity</TableHeadCell>
				<TableHeadCell>Age</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Date</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.reports as report}
					<TableBodyRow>
						<TableBodyCell>{report.id}</TableBodyCell>
						<TableBodyCell>{report.medicationName}</TableBodyCell>
						<TableBodyCell>{report.sideEffect}</TableBodyCell>
						<TableBodyCell>{report.severity}</TableBodyCell>
						<TableBodyCell>{report.age}</TableBodyCell>
						<TableBodyCell>{report.gender}</TableBodyCell>
						<TableBodyCell>{new Date(report.createdAt).toLocaleDateString()}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
