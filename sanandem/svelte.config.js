import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto issue workaround
		adapter: {
            name: 'dummy',
            adapt(builder) {
                console.log('Dummy adapter running');
            }
        },
		alias: {
			"$messages": "./src/messages"
		}
	}
};

export default config;
