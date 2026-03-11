<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte"

	export let message = "Note deleted"
	let visible = true

	const dispatch = createEventDispatcher()

	const timer = setTimeout(() => {
		visible = false
		dispatch("timeout")
	}, 10000)

	onDestroy(() => clearTimeout(timer))
</script>

{#if visible}
<div class="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-xl z-50">

	{message}

	<button
		class="ml-3 underline"
		on:click={() => dispatch("undo")}
	>
	Undo
	</button>

</div>
{/if}