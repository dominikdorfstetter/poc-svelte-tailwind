<script lang="ts">
    import {writable} from 'svelte/store';
    import Button from './components/Button.svelte';
    import {observe} from 'svelte-observable';
    import Pokecard from "./components/Pokecard.svelte";
    import {PokeService} from "./poke.service";
    const pokeService = new PokeService();
    const count = writable(0);
    const pokemon = observe(pokeService.getPokemon$());
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

    {#await $pokemon}
        <div class="loading-container">
            <img alt="pokemons are loading" src="../assets/loading.gif" class="loading"/>
        </div>
    {:then poke}
        <div class="p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {#each poke as p}
                <Pokecard pokemon={p}/>
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