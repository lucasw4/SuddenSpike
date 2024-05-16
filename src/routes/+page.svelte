<script lang="ts">
	import '../app.css';
	import axios from 'axios';

	import ItemsTable from '$lib/components/ItemsTable.svelte';

	import Home from 'lucide-svelte/icons/home';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import Package2 from 'lucide-svelte/icons/package-2';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import { RotateCw } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type LatestPriceData = {
		data: {
			[key: string]: {
				high: number;
			};
		};
	};
	type OldPriceData = {
		data: {
			[key: string]: {
				avgHighPrice: number;
			};
		};
	};

	type Item = {
		id: number;
		latestPrice: string;
		oldPrice: string;
	};

	let items: Item[] = [];

	async function fetchPrices() {
		try {
			const [latestRes, oldRes] = await Promise.all([
				axios.get('https://prices.runescape.wiki/api/v1/osrs/latest', {
					headers: {
						'User-Agent':
							'SuddenSpike (In development webapp using JS to check for items that spike >5% in price over 5 mins; Contact info: realpeakoe@gmail.com or Discord: lucasiona)'
					}
				}),
				axios.get('https://prices.runescape.wiki/api/v1/osrs/5m', {
					headers: {
						'User-Agent':
							'SuddenSpike (In development webapp using JS to check for items that spike >5% in price over 5 mins; Contact info: realpeakoe@gmail.com or Discord: lucasiona)'
					}
				})
			]);

			const latestPrices: LatestPriceData = latestRes.data;
			const oldPrices: OldPriceData = oldRes.data;

			// console.log(latestPrices.data);
			// console.log(latestPrices.data[2].high);
			// console.log(Object.keys(latestPrices.data));

			items = [
				...Object.keys(latestPrices.data).map((id) => {
					const latestData = latestPrices.data[id];
					const oldData = oldPrices.data[id];
					const latest = latestData ? latestData.high : undefined;
					const old = oldData ? oldData.avgHighPrice : undefined;
					console.log(latest);
					console.log(old);
					return {
						id: Number(id),
						latestPrice: latest ? `$${latest.toFixed(2)}` : 'N/A',
						oldPrice: old ? `$${old.toFixed(2)}` : 'N/A'
					};
				})
			];
		} catch (error) {
			console.error('Failed to fetch prices:', error);
		}
	}
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 py-4">
			<a
				href="##"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
			>
				<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
				<span class="sr-only">Acme Inc</span>
			</a>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/"
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<Home class="h-5 w-5" />
						<span class="sr-only">Home</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Home</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="##"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
							<span class="sr-only">Acme Inc</span>
						</a>
						<a
							href="/"
							class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
						>
							<Home class="h-5 w-5" />
							Home
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</header>
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Tabs.Root value="all">
				<div class="flex items-center">
					<Tabs.List>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="active">Active</Tabs.Trigger>
						<Tabs.Trigger value="draft">Draft</Tabs.Trigger>
						<Tabs.Trigger value="archived" class="hidden sm:flex">Archived</Tabs.Trigger>
					</Tabs.List>
					<div class="ml-auto flex items-center gap-2">
						<Button variant="outline" on:click={fetchPrices}><RotateCw /></Button>
					</div>
				</div>
				<Tabs.Content value="all">
					<Card.Root>
						<Card.Header>
							<Card.Title>Items</Card.Title>
							<Card.Description>List of all items.</Card.Description>
						</Card.Header>
						<Card.Content>
							<!-- <ItemsTable {items} /> -->
							{#each items as item (item.id)}
								<p>
									Item ID: {item.id}, Latest Price: {item.latestPrice}, Price 5 mins ago: {item.oldPrice}
								</p>
							{/each}
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</main>
	</div>
</div>
