<script lang="ts">
	import { createNote } from "../lib/api";
	import { notes } from "../stores/notesStore";

	let title = "";
	let content = "";
	let isSubmitting = false;

	async function submit() {
		if (!title.trim() || isSubmitting) return;

		isSubmitting = true;

		const tempId = `optimistic-${Date.now()}`;
		const newNote = {
			id: tempId,
			title,
			content,
			createdAt: new Date().toISOString()
		};

		// 1. Optimistic Update (UI updates immediately)
		notes.update((n) => [newNote as any, ...n]);

		// Clear form immediately for fresh input
		title = "";
		content = "";
		isSubmitting = false;

		try {
			// 2. Background API Call
			const realNote = await createNote(newNote);

			// 3. Swap temp note for real database note silently
			notes.update((n) =>
				n.map((item) => (item.id === tempId ? realNote : item))
			);
		} catch (error) {
			console.error("Failed to create note API", error);
		}
	}
</script>

<div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">

	<form
		on:submit|preventDefault={submit}
		class="space-y-4"
	>

		<input
			class="w-full border rounded p-3 bg-white dark:bg-gray-700 text-black dark:text-white dark:border-white placeholder-gray-400 transition-colors"
			placeholder="Title"
			required
			maxlength="100"
			bind:value={title}
		/>

		<textarea
			class="w-full border rounded p-3 bg-white dark:bg-gray-700 text-black dark:text-white dark:border-white placeholder-gray-400 transition-colors"
			rows="3"
			placeholder="Content"
			maxlength="500"
			bind:value={content}
		></textarea>

		<button
			class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
			disabled={isSubmitting}
		>
			{#if isSubmitting}
				<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
			{/if}
			Create Note
		</button>

	</form>

</div>