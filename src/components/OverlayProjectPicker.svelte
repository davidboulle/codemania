<script lang="ts">
	import CardProject from '$components/CardProject.svelte';
	import Spinner from '$components/Spinner.svelte';
	import { onMount } from 'svelte';
	import { Project } from '$models/Project.js';
	import { ProjectFile } from '$models/ProjectFile.js';
	import { createEventDispatcher } from 'svelte';
	import { blur } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let projects: Project[] = [];

	// move loader in page.svelte
	onMount(() => setTimeout(load, 500));

	let loading = true;

	function load() {
		loading = false;

		let project1 = new Project('daisyui', 'saadeghi');
		project1.files.push(new ProjectFile('https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/createPlugin.js'));

		let project2 = new Project('OpenGFW', 'apernet');
		project2.files.push(new ProjectFile('https://raw.githubusercontent.com/apernet/OpenGFW/master/analyzer/interface.go'));
		project2.files.push(new ProjectFile('https://raw.githubusercontent.com/apernet/OpenGFW/master/analyzer/internal/tls.go'));

		let project3 = new Project('LaVague', 'lavague-ai');
		project3.files.push(new ProjectFile('https://raw.githubusercontent.com/lavague-ai/LaVague/main/src/lavague/defaults.py'));
		project3.files.push(new ProjectFile('https://raw.githubusercontent.com/lavague-ai/LaVague/main/src/lavague/__init__.py'));
		project3.files.push(new ProjectFile('https://raw.githubusercontent.com/lavague-ai/LaVague/main/src/lavague/ActionEngine.py'));
		project3.files.push(new ProjectFile('https://raw.githubusercontent.com/lavague-ai/LaVague/main/src/lavague/default_prompt.py'));

		projects = [project1, project2, project3];
	}
</script>

<div out:blur={{ duration: 800 }} class="widget-stats absolute z-30 flex h-screen w-screen items-center justify-center bg-slate-300 bg-opacity-100 text-center">
	{#if loading}
		<Spinner />
	{:else}
		<div class="flex flex-col gap-4 rounded-lg bg-slate-200 p-4 shadow-sm">
			<p class="text-slate-400">Start a new project</p>
			{#each projects as project}
				<CardProject {project} on:click={() => dispatch('selected', project)} />
			{/each}
		</div>
	{/if}
</div>
