<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from '$lib/components/Chart.svelte';
    import { graphData } from '$lib/data/mock';

    // Graph Chart Configuration
    let graphOptions = {
        title: {
            text: 'Medication Side Effect Network',
            subtext: 'Circular Layout',
            top: 'bottom',
            left: 'right',
            textStyle: { color: '#ccc' }
        },
        tooltip: {},
        legend: [{
            data: graphData.nodes.map(function (a) {
                return a.id;
            }),
            textStyle: { color: '#ccc' }
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'circular',
                circular: {
                    rotateLabel: true
                },
                data: graphData.nodes.map(n => ({
                    id: n.id,
                    name: n.id,
                    symbolSize: n.radius,
                    value: n.radius,
                    category: n.group,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    },
                    itemStyle: {
                        color: n.group === 1 ? '#ef4444' : n.group === 2 ? '#3b82f6' : '#10b981'
                    }
                })),
                links: graphData.links.map(l => ({
                    source: l.source,
                    target: l.target,
                    value: l.value,
                    lineStyle: {
                        width: l.value / 2,
                        curveness: 0.3,
                        opacity: 0.7
                    }
                })),
                categories: [
                    { name: 'Medication' },
                    { name: 'Side Effect' },
                    { name: 'Demographic' }
                ],
                roam: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        ]
    };

    // Animated Beam Simulation (Canvas)
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        if (!canvas) return;
        ctx = canvas.getContext('2d')!;

        let width = canvas.width = canvas.parentElement!.clientWidth;
        let height = canvas.height = 400;

        let particles: any[] = [];

        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, ${Math.random()})`
            };
        }

        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Connect particles
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 150, 255, ${1 - dist/100})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    });

</script>

<div class="container mx-auto p-8 space-y-12">
    <div class="text-center space-y-4">
        <h1 class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Interactive Visualizations
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the complex relationships between medications, side effects, and patient demographics through our interactive network graphs and data simulations.
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Network Graph -->
        <div class="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <div class="p-4 border-b border-slate-700 bg-slate-900/50">
                <h2 class="text-xl font-semibold text-blue-300">Network Relationships</h2>
            </div>
            <div class="h-[500px] w-full">
                <Chart options={graphOptions} />
            </div>
        </div>

        <!-- Animated Simulation -->
        <div class="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <div class="p-4 border-b border-slate-700 bg-slate-900/50">
                <h2 class="text-xl font-semibold text-purple-300">Data Flow Simulation</h2>
            </div>
            <div class="h-[500px] w-full relative bg-slate-900" bind:clientWidth={canvas}>
                <canvas bind:this={canvas} class="w-full h-full"></canvas>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <h3 class="text-4xl font-bold text-white/10 select-none">LIVE DATA</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Cards Section (Bits UI style mockup) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 transition-all hover:scale-105">
            <div class="h-full w-full bg-slate-900 rounded-lg p-6 relative z-10">
                <div class="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Real-time Analysis</h3>
                <p class="text-gray-400 text-sm">Monitoring side effect reports as they come in globally.</p>
            </div>
        </div>

         <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 transition-all hover:scale-105">
            <div class="h-full w-full bg-slate-900 rounded-lg p-6 relative z-10">
                <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Safety Verification</h3>
                <p class="text-gray-400 text-sm">Automated cross-referencing with medical databases.</p>
            </div>
        </div>

         <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 p-1 transition-all hover:scale-105">
            <div class="h-full w-full bg-slate-900 rounded-lg p-6 relative z-10">
                <div class="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Community Driven</h3>
                <p class="text-gray-400 text-sm">Empowering patients to share their experiences anonymously.</p>
            </div>
        </div>
    </section>
</div>
