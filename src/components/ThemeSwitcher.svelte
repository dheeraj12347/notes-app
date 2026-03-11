<script lang="ts">
	import { accentColor } from "../stores/notesStore";

	const themes = [
		{ name: "blue", class: "bg-blue-500" },
		{ name: "emerald", class: "bg-emerald-500" },
		{ name: "rose", class: "bg-rose-500" },
		{ name: "amber", class: "bg-amber-500" }
	];

	function setTheme(name: string) {
		accentColor.set(name);
	}
</script>

<div class="flex items-center gap-2 mr-4">
	{#each themes as theme}
		<button
			class="w-6 h-6 rounded-full cursor-pointer transition-transform duration-200 border-2 {theme.class} {$accentColor === theme.name ? 'scale-125 border-gray-800 dark:border-white shadow' : 'border-transparent hover:scale-110'}"
			aria-label={`Set theme to ${theme.name}`}
			title={`Set theme to ${theme.name}`}
			on:click={() => setTheme(theme.name)}
		></button>
	{/each}
</div>
