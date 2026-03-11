<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { updateNote } from "../lib/api";
	import { notes } from "../stores/notesStore";
	import type { Note } from "../types/note";

	export let note: Note;

	let title = note.title;
	let content = note.content;
	let isSubmitting = false;

	const dispatch = createEventDispatcher();

	async function save() {
		if (!title.trim() || isSubmitting) return;

		isSubmitting = true;

		// 1. Optimistic UI update
		notes.update((n) =>
			n.map((item) => (item.id === note.id ? { ...item, title, content } : item))
		);

		// 2. Instantly close modal for max responsiveness
		dispatch("close");

		try {
			// 3. Fire API asynchronously
			await updateNote(note.id, { title, content });
		} catch (error) {
			console.error("Failed to update note", error);
			// Rollback logic could go here if critical
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") dispatch("close");
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

	<div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg dark:border dark:border-white">

		<h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">
			Edit Note
		</h2>

		<input
			class="w-full border rounded p-2 mb-3 bg-white dark:bg-gray-700 text-black dark:text-white dark:border-white transition-colors"
			bind:value={title}
			required
			maxlength="100"
		/>

		<textarea
			class="w-full border rounded p-2 mb-4 bg-white dark:bg-gray-700 text-black dark:text-white dark:border-white transition-colors"
			rows="3"
			bind:value={content}
			maxlength="500"
		></textarea>

		<div class="flex justify-end gap-3 mt-6">

			<button
				class="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white dark:border-white transition-colors"
				on:click={() => dispatch("close")}
				disabled={isSubmitting}
			>
				Cancel
			</button>

			<button
				class="px-4 py-2 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
				on:click={save}
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
				{/if}
				Save Changes
			</button>

		</div>

	</div>

</div>