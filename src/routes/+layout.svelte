<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {

		const theme = localStorage.getItem("theme");

		if(theme === "dark"){
			document.documentElement.classList.add("dark");
		}

		window.addEventListener("keydown",(e)=>{

			if(e.ctrlKey && e.key==="n"){
				e.preventDefault();
				document.querySelector("input")?.focus();
			}

		})

	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}