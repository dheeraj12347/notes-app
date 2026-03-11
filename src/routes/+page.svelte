<script lang="ts">
	import { onMount } from "svelte";
	import { notes, loading, search, page, sortBy, order, isOnline, syncing } from "../stores/notesStore";
	import { getNotes } from "../lib/api";

	import NoteCard from "../components/NoteCard.svelte";
	import NoteForm from "../components/NoteForm.svelte";
	import SearchBar from "../components/SearchBar.svelte";
	import Pagination from "../components/Pagination.svelte";
	import SortDropdown from "../components/SortDropdown.svelte";
	import DarkModeToggle from "../components/DarkModeToggle.svelte";
	import ThemeSwitcher from "../components/ThemeSwitcher.svelte";
	import LoadingSkeleton from "../components/LoadingSkeleton.svelte";

	async function loadNotes() {
		try {
			loading.set(true);

			const data = await getNotes(
				$page,
				$search,
				$sortBy,
				$order
			);

			notes.set(data);

		} catch (error) {

			console.error("Error fetching notes:", error);

		} finally {

			loading.set(false);

		}
	}

	onMount(loadNotes);

	// reactive reload when state changes
	$: if ($page !== undefined || $search !== undefined || $sortBy || $order) {
		loadNotes();
	}

	// pinned notes always appear first
	function sortPinned(list: import("../types/note").Note[]) {
		return [...list].sort((a, b) => {

			if (a.pinned && !b.pinned) return -1
			if (!a.pinned && b.pinned) return 1

			return 0

		})
	}
</script>


<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

	<div class="max-w-6xl mx-auto space-y-6">

		<header class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4">

			<div class="flex items-center gap-4">
				<h1 class="text-3xl font-bold text-gray-800 dark:text-white">
					Notes
				</h1>

				{#if !$isOnline}
					<span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
						<div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div> Offline
					</span>
				{:else if $syncing}
					<span class="px-3 py-1 bg-(--color-primary-light) text-(--color-primary-hover) text-xs font-semibold rounded-full flex items-center gap-1">
						<span class="w-3 h-3 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin"></span> Syncing
					</span>
				{/if}
			</div>

			<div class="flex items-center gap-1">
				<ThemeSwitcher />
				<DarkModeToggle />
			</div>

		</header>


		<!-- Create Note -->
		<NoteForm />


		<!-- Search -->
		<SearchBar />


		<!-- Sorting -->
		<SortDropdown />


		{#if $loading}

			<LoadingSkeleton />

		{:else if $notes.length === 0}

			<div class="text-center py-16">

				{#if $search}

					<p class="text-gray-500 dark:text-gray-400 text-lg">
						No results found for "{$search}"
					</p>

				{:else}

					<p class="text-gray-500 dark:text-gray-400 text-lg">
						No notes yet. Create your first note.
					</p>

				{/if}

			</div>

		{:else}

			<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

				{#each sortPinned($notes) as note (note.id)}
					<NoteCard {note} />
				{/each}

			</div>

		{/if}


		<Pagination />


		<footer class="mt-10 text-center text-gray-500 pb-10">
			<!-- Link to GitHub repository -->
			<a
				href="https://github.com/dheeraj12347"
				target="_blank"
				class="underline text-(--color-primary) hover:text-(--color-primary-hover) font-semibold transition"
			>
				View GitHub Repository
			</a>
		</footer>

	</div>

</div>