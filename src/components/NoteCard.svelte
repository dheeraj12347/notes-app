<script lang="ts">
	import type { Note } from "../types/note";
	import { deleteNote, updateNote } from "../lib/api";
	import { notes } from "../stores/notesStore";
	import DeleteModal from "./DeleteModal.svelte";
	import EditModal from "./EditModal.svelte";
	import Toast from "./Toast.svelte";

	export let note: Note;

	let confirmDelete = false;
	let showEdit = false;

	let showToast = false;
	let deletedNote: Note | null = null;

	async function togglePin() {
		const newPinnedState = !note.pinned;
		
		// Optimistic UI update
		notes.update(n =>
			n.map(item =>
				item.id === note.id
					? { ...item, pinned: newPinnedState }
					: item
			)
		);

		// Persist the change to the API
		try {
			await updateNote(note.id, { pinned: newPinnedState });
		} catch (e) {
			console.error("Failed to persist pin status", e);
			// Revert on failure
			notes.update(n =>
				n.map(item =>
					item.id === note.id
						? { ...item, pinned: !newPinnedState }
						: item
				)
			);
		}
	}

	async function remove() {

		deletedNote = note;

		notes.update(n => n.filter(item => item.id !== note.id));

		showToast = true;

		setTimeout(async () => {
			if (deletedNote) {
				await deleteNote(note.id);
				deletedNote = null;
			}
		}, 10000);

	}
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition dark:border dark:border-white">

	<div class="flex justify-between items-center">

		<h2 class="font-bold text-lg text-gray-800 dark:text-white">
			{note.title}
		</h2>

		<button
			class="text-xl"
			on:click={togglePin}
			title={note.pinned ? "Unpin note" : "Pin note"}
		>
			{#if note.pinned}
				📌
			{:else}
				📍
			{/if}
		</button>

	</div>

	<p class="text-gray-600 dark:text-gray-300 mt-2">
		{note.content}
	</p>

	<div class="flex gap-4 mt-4">

		<button
			class="text-blue-500 hover:underline"
			on:click={() => (showEdit = true)}
		>
			Edit
		</button>

		<button
			class="text-red-500 hover:underline"
			on:click={() => (confirmDelete = true)}
		>
			Delete
		</button>

	</div>

	{#if confirmDelete}
		<DeleteModal
			on:confirm={remove}
			on:cancel={() => (confirmDelete = false)}
		/>
	{/if}

	{#if showEdit}
		<EditModal
			{note}
			on:close={() => (showEdit = false)}
		/>
	{/if}

	{#if showToast}
		<Toast
			on:undo={()=>{
				if(deletedNote !== null){
					const restored = deletedNote;
					notes.update(n => [restored, ...n]);
					deletedNote = null;
				}
				showToast=false;
			}}
		/>
	{/if}

</div>