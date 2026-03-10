<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let message = "Note deleted"
	let visible = true

	const dispatch = createEventDispatcher()

	setTimeout(() => {
		visible = false
		dispatch("timeout")
	}, 10000)
</script>

{#if visible}
<div class="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow">

	{message}

	<button
		class="ml-3 underline"
		on:click={() => dispatch("undo")}
	>
	Undo
	</button>

</div>
{/if}