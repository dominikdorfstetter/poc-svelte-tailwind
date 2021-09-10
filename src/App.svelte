<script lang="ts">
	import { writable } from 'svelte/store';
	import Button from './components/button/Button.svelte';
	import {of, BehaviorSubject, from, toArray} from 'rxjs'
	import { fromFetch } from 'rxjs/fetch';
	import {
		map,
		concatMap,
		catchError,
		switchMap,
		startWith,
		debounceTime
	} from 'rxjs/operators';
	import { observe } from 'svelte-observable';
	import { Pokemon } from 'pokemon';

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

	const pokemon: ReadableStream<Pokemon[]> = observe(pokemon$);

</script>
<main class="p-8">
	<h1 class="text-8xl text-center my-8 uppercase text-red-500">Svelte</h1>
	<h2 class="text-4xl text-center">Also tailwindcss, Hello {name}</h2>

	<div class="my-2 text-center">
		<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl py-8">
			<div class="m-4 text-2xl text-center">
				{#if ($count === 0)}
					Counter leer
				{:else}
					{$count}
				{/if}
			</div>
			<Button text="increase" on:click={() => count.update(n => n + 1)}
					on:dblclick={() => count.update(n => n*n-n)}/>
			<Button text="decrease" on:click={() => $count > 0
				? count.update(n => n - 1)
				: alert('Counter kann nicht weniger als 0 sein!')}/>
		</div>
	</div>
	<div class="text-center uppercase">

	</div>
	<div class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
		{#await $pokemon}
			Values will be changed when calling next instead of subscribe (o.O?)
		{:then poke}
			{#each poke as p (p)}
				<div class="rounded overflow-hidden shadow-lg">
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
		{:catch error}
			{@debug error}
		{/await}
	</div>

</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	.btn {
		@apply font-bold py-2 px-4 rounded;
	}
	.btn-blue {
		@apply bg-blue-500 te:xt-white;
	}
	.btn-blue:hover {
		@apply bg-blue-700;
	}
</style>