import { getNetworkGraphData } from '$lib/server/db/reports.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	try {
		const { nodes, links, totalReports } = await getNetworkGraphData();

		return {
			networkData: {
				nodes,
				links
			},
			totalReports
		};
	} catch (error) {
		console.error('Error loading network data:', error);
		return {
			networkData: {
				nodes: [],
				links: []
			},
			totalReports: 0
		};
	}
};
