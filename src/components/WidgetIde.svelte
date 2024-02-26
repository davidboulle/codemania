<script lang="ts">
	export let widgetName = 'IDE';

	let ideStyle = {
		'border-external': '#b5b5b5',
		'border-internal': '#c5cede',
		'border-tab-unactive': '#d1dbec',
		'border-tab-active': '#c5cede',
		'border-tab-hover': '#c6d4e3',
		'border-tab-focus': '#c5cede',
		'bg-tabs': '#d1dbec',
		'bg-tab-unactive': '#d1dbec',
		'bg-tab-hover': '#c6d4e3',
		'bg-tab-active': 'white',
		'bg-tab-focus': '#f1f4f9',
		'bg-input': 'white',
		'text-tab-unactive': 'rgba(0, 0, 0, 0.7)',
		'text-tab-hover': 'rgba(0, 0, 0, 0.7)',
		'text-tab-active': 'rgba(0, 0, 0, 0.7)',
		'text-tab-focus': 'rgba(0, 0, 0, 0.7)'
	};

	$: cssVarStyles = Object.entries(ideStyle)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	class Tab {
		name = 'undefined.txt';
		constructor(name: string) {
			this.name = name;
		}
	}

	let tabs = [new Tab('+layout.svelte'), new Tab('+layout.svelte'), new Tab('+layout.svelte')];
	let selected = tabs[0];
</script>

<div class="widget-ide ide-default flew-grow relative flex min-h-96 flex-1 select-none flex-col rounded shadow-sm" style={cssVarStyles}>
	<div class="ide-tabs no-scrollbar absolute inline-flex h-12 w-full items-end self-start overflow-x-scroll pt-2">
		<div class="ide-icon relative h-12 min-w-12 select-none border-0 pl-2 pr-3" />
		{#each tabs as tab}
			<button
				on:click={() => (selected = tab)}
				class:active={tab == selected}
				class:unactive={tab != selected}
				class="ide-tab shadow-0 relative h-10 min-w-48 rounded-t-md pb-2 pl-4 pr-4 pt-2 text-start text-sm"
			>
				{tab.name}
			</button>
		{/each}
	</div>
	<textarea class="ide-content mt-12 flex-grow resize-none p-4 outline-none" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="New file"></textarea>
</div>

<style>
	/* IDE Windows_Notepad */

	.ide-default {
		border: solid 1px var(--border-external, gray);
	}

	.ide-default .ide-tabs {
		background-color: var(--bg-tabs);
		color: var(--text-tab);
	}
	.ide-default .ide-tabs .ide-icon {
		background-image: url('$lib/assets/icons/Notepad_Win11.svg');
		background-repeat: no-repeat;
		background-size: 30%;
		position: relative;
		background-position: center;
	}
	.ide-default .ide-tabs .ide-tab.unactive {
		cursor: default;
		background-color: var(--bg-tab-unactive);
		box-sizing: border-box;
		border: solid 1px var(--border-tab-unactive);
	}
	.ide-default .ide-tabs .ide-tab.unactive:hover {
		background-color: var(--bg-tab-hover);
		border: solid 1px var(--border-tab-hover);
		color: var(--text-tab-focus);
	}
	.ide-default .ide-tabs .ide-tab.unactive:focus {
		background-color: var(--bg-tab-focus);
		border: solid 1px var(--border-tab-focus);
		color: var(--text-tab-focus);
	}
	.ide-default .ide-tabs .ide-tab.active {
		cursor: default;
		background-color: var(--bg-tab-active);
		border: solid 1px var(--border-tab-active);
		border-bottom: solid 1px var(--bg-tab-active);
		font-weight: 600;
	}
	.ide-default .ide-content {
		background-color: var(--bg-input);
	}
</style>
