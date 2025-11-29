<script lang="ts">
    import { Chart } from 'svelte-echarts'
	import { AnimatedHeadline } from 'svelte-animated-headline';
	import type { PageData } from './$types';

	let { data } = $props();

	// Options for Charts
	let sideEffectOptions = {
		title: {
			text: 'Most Common Side Effects',
			left: 'center',
            textStyle: {
                color: '#fff'
            }
		},
		tooltip: {
			trigger: 'item'
		},
		series: [
			{
				name: 'Side Effects',
				type: 'pie',
				radius: '50%',
				data: data.sideEffects,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};

	let severityOptions = {
		title: {
			text: 'Average Severity by Medication',
			left: 'center',
            textStyle: {
                color: '#fff'
            }
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			data: data.severityByMed.map(d => d.name),
            axisLabel: { color: '#fff' }
		},
		yAxis: {
			type: 'value',
            axisLabel: { color: '#fff' }
		},
		series: [
			{
				data: data.severityByMed.map(d => d.value),
				type: 'bar',
				showBackground: true,
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)'
				}
			}
		]
	};
</script>

<div class="min-h-screen bg-slate-900 text-white font-sans">
	<header class="p-8 text-center">
        <h1 class="text-4xl font-bold mb-2">
            Medication Side Effects
        </h1>
        <div class="text-2xl text-blue-400">
		    <AnimatedHeadline phrases={['Visualize Data', 'Improve Research', 'Share Experiences']} />
        </div>
	</header>

	<main class="container mx-auto p-4 space-y-12">
		<section class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-slate-800 p-6 rounded-lg shadow-lg h-[400px]">
				<Chart options={sideEffectOptions} />
			</div>
			<div class="bg-slate-800 p-6 rounded-lg shadow-lg h-[400px]">
				<Chart options={severityOptions} />
			</div>
		</section>

		<section class="text-center py-12">
			<h2 class="text-3xl font-bold mb-4">Contribute to Research</h2>
			<p class="text-gray-400 mb-6">Your anonymous data helps us understand medication effects better.</p>
			<!-- In a real app, this would link to a public submission form, possibly reusing the admin form logic but styled differently -->
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                Submit a Report
            </button>
		</section>
	</main>
</div>

<style>
	:global(body) {
		background-color: #0f172a; /* slate-900 */
        margin: 0;
	}
</style>
