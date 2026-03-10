<script lang="ts">
	import { onMount } from "svelte"

	let dark = false

	onMount(() => {

		const stored = localStorage.getItem("theme")

		if(stored === "dark"){
			document.documentElement.classList.add("dark")
			dark = true
		}else{
			document.documentElement.classList.remove("dark")
			dark = false
		}

	})

	function toggle(){

		dark = !dark

		if(dark){
			document.documentElement.classList.add("dark")
			localStorage.setItem("theme","dark")
		}else{
			document.documentElement.classList.remove("dark")
			localStorage.setItem("theme","light")
		}

	}
</script>

<button
	class="border px-3 py-1 rounded flex items-center gap-2 dark:border-white dark:text-white transition-colors"
	on:click={toggle}
>

	{#if dark}
		☀ Light Mode
	{:else}
		🌙 Dark Mode
	{/if}

</button>