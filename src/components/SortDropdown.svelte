<script lang="ts">
	import { sortBy, order, page } from "../stores/notesStore"

	function changeSort(e: Event) {
		const value = (e.target as HTMLSelectElement).value

		if (value === "title") {
			sortBy.set("title")
			order.set("asc")
			page.set(1)
		}

		if (value === "date") {
			sortBy.set("createdAt")
			order.set("desc")
			page.set(1)
		}

		if (value === "id") {
			sortBy.set("id")
			order.set("asc")
			page.set(1)
		}
	}
</script>

<select
	class="border rounded px-3 py-2 mb-4 bg-white dark:bg-gray-800 text-black dark:text-white dark:border-white transition-colors cursor-pointer"
	on:change={changeSort}
>
	<option value="date">Newest</option>
	<option value="title">Title</option>
	<option value="id">ID</option>
</select>