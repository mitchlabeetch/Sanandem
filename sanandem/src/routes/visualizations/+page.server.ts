import { getReports } from '$lib/server/db/reports.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all reports for network graph
		const reports = await getReports({ limit: 500 });

		// Build network data
		interface Node {
			id: string;
			label: string;
			type: 'medication' | 'effect';
			count: number;
		}

		interface Link {
			source: string;
			target: string;
			value: number;
		}

		const nodes: Map<string, Node> = new Map();
		const links: Map<string, Link> = new Map();

		// Process reports to create network
		reports.forEach((report) => {
			const medId = `med_${report.medicationName}`;
			
			// Add or update medication node
			if (!nodes.has(medId)) {
				nodes.set(medId, {
					id: medId,
					label: report.medicationName,
					type: 'medication',
					count: 1
				});
			} else {
				const node = nodes.get(medId)!;
				node.count++;
			}

			// Add effect nodes and links
			if (Array.isArray(report.sideEffects)) {
				report.sideEffects.forEach((effect) => {
					const effectId = `effect_${effect}`;
					
					// Add or update effect node
					if (!nodes.has(effectId)) {
						nodes.set(effectId, {
							id: effectId,
							label: effect,
							type: 'effect',
							count: 1
						});
					} else {
						const node = nodes.get(effectId)!;
						node.count++;
					}

					// Add or update link
					const linkId = `${medId}_${effectId}`;
					if (!links.has(linkId)) {
						links.set(linkId, {
							source: medId,
							target: effectId,
							value: 1
						});
					} else {
						const link = links.get(linkId)!;
						link.value++;
					}
				});
			}
		});

		return {
			networkData: {
				nodes: Array.from(nodes.values()),
				links: Array.from(links.values())
			},
			totalReports: reports.length
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
