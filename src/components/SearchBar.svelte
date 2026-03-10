<script lang="ts">
	import { search, page } from "../stores/notesStore";
	import { debounce } from "../lib/debounce";

	const debounced = debounce((value: string) => {
		search.set(value);
		page.set(1);
	}, 400);

	function handle(e: Event) {
		const target = e.target as HTMLInputElement;
		debounced(target.value);
	}
</script>

<input
	class="w-full border rounded p-3 bg-white dark:bg-gray-700 text-black dark:text-white dark:border-white placeholder-gray-400 mb-6 transition-colors"
	placeholder="Search notes..."
	on:input={handle}
/>