<script lang="ts">
	import { page, hasMore, loading } from "../stores/notesStore"

	function loadMore(){
		if (!$loading && $hasMore) {
			page.update(p => p + 1)
		}
	}
</script>

{#if $hasMore}
<div class="flex justify-center mt-10">
	<button on:click={loadMore} disabled={$loading} class="border-2 border-(--color-primary) text-(--color-primary) px-6 py-2 rounded-full font-bold hover:bg-(--color-primary-light) transition-colors shadow-sm disabled:opacity-50">
	{$loading ? 'Loading...' : 'Load More Notes'}
	</button>
</div>
{/if}