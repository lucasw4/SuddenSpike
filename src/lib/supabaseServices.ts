import { supabase } from './supabaseClient.js';
import axios from 'axios';

// Fetch the current prices from the database
export async function fetchPrices() {
	const { data, error } = await supabase.from('prices').select('id, current_price, five_min_price');

	if (error) {
		console.error('Error fetching prices:', error);
		return;
	}

	return data;
}

type LatestPriceData = {
	data: {
		[key: string]: {
			high: number;
		};
	};
};

interface ItemInfo {
	examine: string;
	id: number;
	members: boolean;
	lowalch: number;
	limit: number;
	value: number;
	highalch: number;
	icon: string;
	name: string;
}

export async function initPrices() {
	const latestRes = await axios.get('https://prices.runescape.wiki/api/v1/osrs/latest', {
		headers: {
			'User-Agent':
				'SuddenSpike (In development webapp using JS to check for items that spike >5% in price over 5 mins; Contact info: realpeakoe@gmail.com or Discord: lucasiona)'
		}
	});

	const latestPrices: LatestPriceData = latestRes.data;

	const itemInfoRes = await axios.get('https://prices.runescape.wiki/api/v1/osrs/mapping', {
		headers: {
			'User-Agent':
				'SuddenSpike (In development webapp using JS to check for items that spike >5% in price over 5 mins; Contact info: realpeakoe@gmail.com or Discord: lucasiona)'
		}
	});

	const itemInfoData: ItemInfo[] = itemInfoRes.data;

	const items = [];
	for (let id in latestPrices.data) {
		const high = latestPrices.data[id].high;

		const itemName = itemInfoData.find((item: ItemInfo) => item.id === Number(id))?.name;

		items.push({
			id: id,
			current_price: high ? high : 0,
			five_min_price: high ? high : 0,
			name: itemName
		});
	}

	const { error } = await supabase.from('prices').insert(items);

	if (error) {
		console.error('Error inserting prices:', error);
	}
}

export async function updatePrices() {
	console.log('Starting updatePrices function');

	// Fetch all the current prices from the database
	let currentPrices: any[] = [];
	let i = 0;
	while (true) {
		const { data, error } = await supabase
			.from('prices')
			.select('id, current_price')
			.order('id')
			.range(i * 1000, (i + 1) * 1000 - 1);

		if (error) {
			console.error('Error fetching prices:', error);
			return;
		}

		currentPrices = [...currentPrices, ...data];

		if (data.length < 1000) {
			break;
		}

		i++;
	}

	// Update the five_min_price with the current prices
	const fiveMinUpdates = currentPrices.map((price) => ({
		id: price.id,
		five_min_price: price.current_price
	}));
	console.log('Performing five minute updates:', fiveMinUpdates);
	let { error: updateError } = await supabase.from('prices').upsert(fiveMinUpdates);

	if (updateError) {
		console.error('Error updating five minute prices:', updateError);
		return;
	}

	// Fetch the latest prices from the API
	const latestRes = await axios.get('https://prices.runescape.wiki/api/v1/osrs/latest', {
		headers: {
			'User-Agent':
				'SuddenSpike (In development webapp using JS to check for items that spike >5% in price over 5 mins; Contact info: realpeakoe@gmail.com or Discord: lucasiona)'
		}
	});

	const latestPrices: LatestPriceData = latestRes.data;
	console.log('Fetched latest prices:', latestPrices);

	// Update the current_price with the latest prices
	const currentUpdates = [];
	for (let id in latestPrices.data) {
		const high = latestPrices.data[id].high;

		// Add the update to the array
		currentUpdates.push({ id: Number(id), current_price: high ? high : 0 });
	}

	console.log('Performing current price updates:', currentUpdates);
	updateError = (await supabase.from('prices').upsert(currentUpdates)).error;

	if (updateError) {
		console.error('Error updating current prices:', updateError);
	} else {
		console.log('Successfully updated prices');
	}
}
