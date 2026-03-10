<script lang="ts">

	import { page } from "../stores/notesStore"

	function next(){
		page.update(p => p + 1)
	}

	function prev(){
		page.update(p => Math.max(1,p-1))
	}
</script>

<div class="flex gap-4 justify-center mt-6">

	<button on:click={prev} class="border px-4 py-2 rounded-lg text-black dark:text-white dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
	Prev
	</button>

	<button on:click={next} class="border px-4 py-2 rounded-lg text-black dark:text-white dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
	Next
	</button>

</div>