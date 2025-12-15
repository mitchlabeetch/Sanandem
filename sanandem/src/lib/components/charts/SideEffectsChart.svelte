<script>
    import Chart from '$lib/components/Chart.svelte';
    let options = {
        title: { text: 'Side Effects Distribution', textStyle: { color: '#ccc' } },
        tooltip: {},
        xAxis: { data: ['Nausea', 'Dizziness', 'Headache', 'Rash', 'Fatigue'], axisLabel: { color: '#ccc' } },
        yAxis: { axisLabel: { color: '#ccc' } },
        series: [{ type: 'bar', data: [120, 90, 80, 60, 50], itemStyle: { color: '#f43f5e' } }]
    };
</script>
<div class="h-80 w-full">
    <Chart {options} />
</div>
