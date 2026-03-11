<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import favicon from '$lib/assets/favicon.svg';
	import { accentColor } from "../stores/notesStore";
	
	let { children } = $props();

	onMount(() => {

		const savedTheme = localStorage.getItem("theme");
		if(savedTheme === "dark"){
			document.documentElement.classList.add("dark");
		}

		const savedColor = localStorage.getItem("accentColor");
		if (savedColor) {
			accentColor.set(savedColor);
			document.documentElement.setAttribute("data-theme", savedColor);
		}

		// Sync Accent Color
		accentColor.subscribe((color) => {
			document.documentElement.setAttribute("data-theme", color);
			localStorage.setItem("accentColor", color);
		});

	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}