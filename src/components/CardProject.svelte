<script lang="ts">
	import { Project } from '$models/Project.js';

	export let project: Project;
</script>

<button on:click class="block w-96 rounded bg-slate-100 p-4 text-start shadow-sm drop-shadow-sm transition hover:drop-shadow active:bg-slate-50 active:drop-shadow-none">
	<p class="w-full overflow-ellipsis text-xl text-slate-600">{project.name}</p>
	<p class="text-sm text-slate-300">{project.author}</p>
	<p class="text-end text-sm text-slate-400 text-opacity-75">{project.files.length} files</p>
</button>
