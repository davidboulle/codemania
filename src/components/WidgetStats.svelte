<script lang="ts">
	import type { Project } from '$models/Project';
	export let widgetName = 'Stats';

	export let project: Project;
</script>

<div class="widget-stats flex h-[30%] min-h-48 rounded bg-slate-100 p-4 shadow-sm">{project.name} - {widgetName}</div>
