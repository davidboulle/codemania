<script lang="ts">
	import type { Project } from '$models/Project';

	export let widgetName = 'Management';

	export let project: Project;
</script>

<div class="widget-management flex min-h-48 flex-1 overflow-hidden rounded bg-slate-100 p-4 shadow-sm">{project.name} - {widgetName}</div>
