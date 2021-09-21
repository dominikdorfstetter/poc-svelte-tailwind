<script lang="ts">
    import { Pokemon } from "../models/pokemon";

    export let pokemon: Pokemon;
</script>

<!-- BEGIN: TEMPLATE -->
<div class="pokecard rounded overflow-hidden shadow-lg bg-white">
    <img class="w-auto h-4xl m-auto" src={pokemon.sprites.front_default} alt={pokemon.name}>
    <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2 uppercase">{pokemon.name}</div>
        <p class="text-gray-700 text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
        </p>
    </div>
    <div class="px-6 pt-4 pb-2">
        {#each pokemon.types as type}
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{type.type.name}</span>
        {/each}
    </div>
</div>
<!-- END: TEMPLATE -->

<style lang="postcss">
    .pokecard:hover {
        filter: grayscale(0.9) blur(1px);
        cursor: pointer;
    }
</style>