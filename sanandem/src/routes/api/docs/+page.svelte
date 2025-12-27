<script lang="ts">
    import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto" in:fade>
        <h1 class="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400">API Documentation</h1>

        <div class="prose dark:prose-invert max-w-none">
            <p class="text-xl mb-8">
                Sanandem provides a public REST API for researchers and developers to access anonymized medication report data.
            </p>

            <div class="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
                <h2 class="text-2xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Endpoints</h2>

                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">GET</span>
                        <code class="text-lg font-mono">/api/reports</code>
                    </div>
                    <p class="mb-4">Retrieve a paginated list of anonymized medication reports.</p>

                    <h3 class="font-semibold mb-2">Query Parameters</h3>
                    <ul class="list-disc list-inside space-y-1 ml-4 mb-4">
                        <li><code>limit</code> (optional): Number of records to return (default: 20, max: 100)</li>
                        <li><code>offset</code> (optional): Pagination offset</li>
                        <li><code>medicationName</code> (optional): Filter by medication name (fuzzy match)</li>
                        <li><code>gender</code> (optional): Filter by gender</li>
                        <li><code>minAge</code>, <code>maxAge</code> (optional): Filter by age range</li>
                        <li><code>minSeverity</code>, <code>maxSeverity</code> (optional): Filter by severity range (1-10)</li>
                    </ul>

                    <h3 class="font-semibold mb-2">Response Example</h3>
                    <pre class="bg-gray-800 text-gray-200 p-4 rounded overflow-x-auto text-sm">
{`{
  "data": [
    {
      "id": 123,
      "medicationName": "Ibuprofen",
      "sideEffects": ["nausea", "dizziness"],
      "severity": 4,
      "ageGroup": "36-50",
      "gender": "female",
      "createdAt": "2023-10-27T10:00:00Z"
    }
  ],
  "meta": {
    "limit": 20,
    "offset": 0,
    "total": 150
  }
}`}
                    </pre>
                </div>

                <div class="mb-8">
                     <div class="flex items-center gap-3 mb-2">
                        <span class="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">GET</span>
                        <code class="text-lg font-mono">/api/export</code>
                    </div>
                    <p class="mb-4">Download dataset in various formats.</p>
                     <h3 class="font-semibold mb-2">Query Parameters</h3>
                    <ul class="list-disc list-inside space-y-1 ml-4 mb-4">
                        <li><code>format</code>: <code>json</code> or <code>csv</code> (default: json)</li>
                    </ul>
                </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Authentication & Rate Limiting</h2>
                <p>The API is public and does not require an API key for read-only access. However, usage is rate-limited to <strong>100 requests per 15 minutes</strong> per IP address to ensure service stability.</p>
            </div>
        </div>
    </div>
</div>
