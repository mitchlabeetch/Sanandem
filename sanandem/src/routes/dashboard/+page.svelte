<script lang="ts">
    import { Chart } from 'svelte-echarts';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    // Interactive Filters
    let searchTerm = $state('');
    let selectedGender = $state('all');
    let minSeverity = $state(1);

    // Transform data for use
    const reports = data.reports || [];
    const statistics = data.statistics || { totalReports: 0, byGender: [], bySeverity: [], byAgeGroup: [] };
    const medicationStats = data.medicationStats || [];

    // Derived filtered data
    let filteredReports = $derived(reports.filter((r: any) => {
        const sideEffectsText = Array.isArray(r.sideEffects) ? r.sideEffects.join(' ') : '';
        const medicationText = r.medicationName || '';
        const matchesSearch = medicationText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sideEffectsText.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = selectedGender === 'all' || r.gender === selectedGender;
        const matchesSeverity = (r.severity || 0) >= minSeverity;
        return matchesSearch && matchesGender && matchesSeverity;
    }));

    // Calculate severity distribution for chart
    const severityMild = reports.filter((r: any) => (r.severity || 0) <= 3).length;
    const severityModerate = reports.filter((r: any) => (r.severity || 0) > 3 && (r.severity || 0) <= 7).length;
    const severitySevere = reports.filter((r: any) => (r.severity || 0) > 7).length;

    // Prepare side effect data for pie chart
    const sideEffectCounts: Record<string, number> = {};
    reports.forEach((r: any) => {
        if (Array.isArray(r.sideEffects)) {
            r.sideEffects.forEach((effect: string) => {
                sideEffectCounts[effect] = (sideEffectCounts[effect] || 0) + 1;
            });
        }
    });
    const sideEffectStats = Object.entries(sideEffectCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

    // Chart Options
    let barOptions = {
        title: { text: 'Reports by Severity', left: 'center', textStyle: { color: '#ccc' } },
        tooltip: { trigger: 'item' },
        xAxis: { type: 'category', data: ['Mild (1-3)', 'Moderate (4-7)', 'Severe (8-10)'], axisLabel: { color: '#ccc' } },
        yAxis: { type: 'value', axisLabel: { color: '#ccc' } },
        series: [{
            data: [severityMild, severityModerate, severitySevere],
            type: 'bar',
            itemStyle: { color: '#3b82f6' }
        }]
    };

    let pieOptions = {
        title: { text: 'Top Side Effects', left: 'center', textStyle: { color: '#ccc' } },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#1e293b', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold', color: '#fff' } },
            labelLine: { show: false },
            data: sideEffectStats
        }]
    };

    let lineOptions = {
        title: { text: 'Average Severity by Medication', left: 'center', textStyle: { color: '#ccc' } },
        tooltip: { trigger: 'axis' },
        xAxis: { 
            type: 'category', 
            boundaryGap: false, 
            data: medicationStats.slice(0, 10).map((d: any) => d.medicationName), 
            axisLabel: { color: '#ccc', rotate: 45 } 
        },
        yAxis: { type: 'value', min: 0, max: 10, axisLabel: { color: '#ccc' } },
        series: [{
            data: medicationStats.slice(0, 10).map((d: any) => parseFloat(d.avgSeverity || '0')),
            type: 'line',
            areaStyle: { opacity: 0.3 },
            smooth: true,
            itemStyle: { color: '#10b981' }
        }]
    };


<div class="container mx-auto p-6 space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-white">Research Dashboard</h1>
        <div class="flex space-x-2 text-sm text-gray-400">
            <span>Last Updated:</span>
            <span class="text-white font-mono">{new Date().toLocaleDateString()}</span>
        </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter Data
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label for="search" class="block text-sm font-medium text-gray-300 mb-1">Search Medication/Effect</label>
                <input
                    type="text"
                    id="search"
                    bind:value={searchTerm}
                    placeholder="e.g. Aspirin..."
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div>
                <label for="gender" class="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select
                    id="gender"
                    bind:value={selectedGender}
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div>
                <label for="severity" class="block text-sm font-medium text-gray-300 mb-1">Min Severity: {minSeverity}</label>
                <input
                    type="range"
                    id="severity"
                    min="1"
                    max="10"
                    bind:value={minSeverity}
                    class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div class="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-80">
            <Chart options={barOptions} />
        </div>
        <div class="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-80">
            <Chart options={pieOptions} />
        </div>
        <div class="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-80 lg:col-span-2 xl:col-span-1">
            <Chart options={lineOptions} />
        </div>
    </div>

    <!-- Data Table -->
    <div class="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <h2 class="text-lg font-semibold text-white">Recent Reports</h2>
            <span class="text-sm bg-blue-900 text-blue-300 px-3 py-1 rounded-full">{filteredReports.length} records found</span>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-slate-900 text-xs uppercase text-gray-400">
                    <tr>
                        <th class="px-6 py-3">Medication</th>
                        <th class="px-6 py-3">Side Effect</th>
                        <th class="px-6 py-3">Severity</th>
                        <th class="px-6 py-3">Demographics</th>
                        <th class="px-6 py-3">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                    {#each filteredReports.slice(0, 10) as report}
                        <tr class="hover:bg-slate-700/50 transition-colors">
                            <td class="px-6 py-4 font-medium text-white">{report.medicationName}</td>
                            <td class="px-6 py-4">
                                {#if Array.isArray(report.sideEffects)}
                                    {report.sideEffects.slice(0, 3).join(', ')}
                                    {#if report.sideEffects.length > 3}
                                        <span class="text-gray-500">+{report.sideEffects.length - 3} more</span>
                                    {/if}
                                {:else}
                                    {report.sideEffects || 'N/A'}
                                {/if}
                            </td>
                            <td class="px-6 py-4">
                                <div class="w-full bg-slate-700 rounded-full h-2.5 max-w-[100px]">
                                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: {(report.severity || 0) * 10}%"></div>
                                </div>
                                <span class="text-xs mt-1 block">{report.severity || 'N/A'}/10</span>
                            </td>
                            <td class="px-6 py-4">
                                {#if report.age}
                                    {report.age} yo
                                {:else if report.ageGroup}
                                    {report.ageGroup}
                                {:else}
                                    N/A
                                {/if}
                                {#if report.gender}
                                    , <span class="capitalize">{report.gender}</span>
                                {/if}
                            </td>
                            <td class="px-6 py-4">{new Date(report.createdAt).toLocaleDateString()}</td>
                        </tr>
                    {/each}
                    {#if filteredReports.length === 0}
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                {#if reports.length === 0}
                                    No reports in database yet. Submit the first one!
                                {:else}
                                    No reports found matching your criteria.
                                {/if}
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
