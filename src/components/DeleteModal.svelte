<script lang="ts">
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()

	function confirm(){
		dispatch("confirm")
	}

	function cancel(){
		dispatch("cancel")
	}

	function handleKeydown(e: KeyboardEvent){
		if(e.key === "Escape") cancel()
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

	<div class="bg-white dark:bg-gray-800 dark:border dark:border-white dark:text-white p-6 rounded-lg shadow transition-colors">

		<p class="mb-4">
		Are you sure you want to delete this note?
		</p>

		<div class="flex gap-4">

			<button
				class="bg-red-500 text-white px-3 py-1 rounded"
				on:click={confirm}
			>
			Delete
			</button>

			<button
				class="border px-3 py-1 rounded dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
				on:click={cancel}
			>
			Cancel
			</button>

		</div>

	</div>

</div>