<script lang="ts">
	import { writable } from 'svelte/store';
	import Button from './components/Button.svelte';
	import {of, from, toArray} from 'rxjs'
	import { fromFetch } from 'rxjs/fetch';
	import {
		map,
		concatMap,
		catchError,
		switchMap
	} from 'rxjs/operators';
	import { observe } from 'svelte-observable';

	const count = writable(0);

	count.subscribe(value => {
		console.log(value);
	}); // logs '0'

	export let name: string;

	const pokemon$ = fromFetch(`https://pokeapi.co/api/v2/pokemon?limit=151`).pipe(
		switchMap((response) => {
			if (response.ok) {
				return response.json();
			} else {
				return of({ error: true, message: `Error ${response.status}` })
			}
		}),
			map((res: any) => res.results),
		switchMap(results => { // split the array into a stream
			return from(results);
		}),
		concatMap((poke) => {
			return fromFetch(poke.url).pipe(
					switchMap((response) => {
						if (response.ok) {
							return response.json();
						} else {
							return of({ error: true, message: `Error ${response.status}` })
						}
					}),
			)
		}),
		toArray(),
		catchError((err) => of({ error: true, message: err.message })),
	);

	const pokemon = observe(pokemon$);

</script>
<main class="md:p-8 sm:p-4">
	<h1 class="text-8xl text-center my-8 uppercase text-red-500">Slender</h1>
	<h2 class="my-7 text-4xl text-center text-white">& beautiful</h2>

	<div class="text-center">
		<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl py-8">
			<div class="m-4 text-2xl text-center">
				{#if ($count === 0)}
					Everything that's created comes out of silence
				{:else}
					{$count}
				{/if}
			</div>
			<Button text="increase" on:click={() => count.update(n => n + 1)}
					on:dblclick={() => count.update(n => n*n-n)}/>
			<Button text="decrease" on:click={() => $count > 0
				? count.update(n => n - 1)
				: alert('Sorry buddy, there can be nothing except nothingness!')}/>
		</div>
	</div>
	<div class="text-center uppercase">

	</div>

		{#await $pokemon}
			<div class="loading-container">
				<img alt="pokemons are loading" src="../assets/loading.gif" class="loading" />
			</div>
		{:then poke}
			<div class="p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
				{#each poke as p (p)}
					<div class="pokecard rounded overflow-hidden shadow-lg bg-white">
						<img class="w-auto h-4xl m-auto" src={p.sprites.front_default} alt={p.name}>
						<div class="px-6 py-4">
							<div class="font-bold text-xl mb-2 uppercase">{p.name}</div>
							<p class="text-gray-700 text-base">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
							</p>
						</div>
						<div class="px-6 pt-4 pb-2">
							{#each p.types as type}
								<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{type.type.name}</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:catch error}
			{@debug error}
		{/await}
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	.loading {
		min-width: 20em;
		height: auto;
		display: table;
		margin: 0 auto;
	}

	.pokecard:hover {
		filter: grayscale(0.9) blur(1px);
		cursor: pointer;
	}

	.btn {
		@apply font-bold py-2 px-4 rounded;
	}
	.btn-blue {
		@apply bg-blue-500 text-white;
	}
	.btn-blue:hover {
		@apply bg-blue-700;
	}
</style>