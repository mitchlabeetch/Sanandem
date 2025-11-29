<script lang="ts">
  import { SvelteFlow, Background, Controls, MiniMap } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import { writable } from 'svelte/store';

  const nodes = writable([
    {
      id: '1',
      type: 'input',
      data: { label: 'Drug Discovery' },
      position: { x: 250, y: 0 },
      style: "background: #fff; border: 1px solid #777; padding: 10px; border-radius: 5px; width: 150px; text-align: center;"
    },
    {
      id: '2',
      data: { label: 'Preclinical Testing (Male Animals)' },
      position: { x: 50, y: 100 },
      style: "background: #fff; border: 1px solid #777; padding: 10px; border-radius: 5px; width: 180px; text-align: center;"
    },
    {
      id: '3',
      data: { label: 'Clinical Trials (Phase I-III)' },
      position: { x: 350, y: 100 },
      style: "background: #e1f5fe; border: 1px solid #0288d1; padding: 10px; border-radius: 5px; width: 180px; text-align: center;"
    },
    {
      id: '4',
      data: { label: 'Regulatory Review' },
      position: { x: 250, y: 250 },
      style: "background: #fff; border: 1px solid #777; padding: 10px; border-radius: 5px; width: 150px; text-align: center;"
    },
    {
      id: '5',
      type: 'output',
      data: { label: 'Market Authorization' },
      position: { x: 250, y: 350 },
      style: "background: #e8f5e9; border: 1px solid #2e7d32; padding: 10px; border-radius: 5px; font-weight: bold; width: 150px; text-align: center;"
    },
    {
        id: '6',
        data: { label: 'Pharmacovigilance (ADR in Women detected)' },
        position: { x: 250, y: 450 },
        style: "background: #ffebee; border: 1px solid #c62828; padding: 10px; border-radius: 5px; width: 200px; text-align: center; color: #c62828;"
    }
  ]);

  const edges = writable([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e4-5', source: '4', target: '5', animated: true, label: 'Approved' },
    { id: 'e5-6', source: '5', target: '6', animated: true, style: 'stroke: #c62828;' }
  ]);
</script>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Drug Approval Pathway</h1>
    <p class="mb-4 text-muted-foreground">Tracing the lifecycle of a drug and where the data gap occurs.</p>

    <div class="h-[600px] w-full border rounded-lg bg-gray-50 shadow-inner">
      <SvelteFlow {nodes} {edges} fitView>
        <Controls />
        <Background />
        <MiniMap />
      </SvelteFlow>
    </div>
</div>
