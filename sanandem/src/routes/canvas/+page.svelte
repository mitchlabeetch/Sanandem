<script>
	import { Canvas, Layer } from 'svelte-canvas';
    import { onMount } from 'svelte';

	const n = 500;
	let particles = $state([]);
    let width = 800;
    let height = 600;

    onMount(() => {
        particles = Array.from({ length: n }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? 'rgba(96, 165, 250, 0.8)' : 'rgba(192, 132, 252, 0.8)', // Blue vs Purple
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        }));
    });

	const render = ({ context, width, height }) => {
        if (particles.length === 0) return;

        // Trail effect
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.fillRect(0, 0, width, height);

		particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

			context.beginPath();
			context.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
			context.fillStyle = p.color;
			context.fill();
		});
	};
</script>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-4">Patient Data Cloud</h1>
    <p class="mb-8 text-muted-foreground">Visualizing 500 data points in motion. Notice how they interact and flow, representing the continuous collection of medical data.</p>

    <div class="border rounded-lg overflow-hidden shadow-xl w-full max-w-[800px] h-[600px] bg-white mx-auto">
	    <Canvas {width} {height} autoplay>
		    <Layer {render} />
	    </Canvas>
    </div>
</div>
