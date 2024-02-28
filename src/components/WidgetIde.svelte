<script lang="ts">
	import { onMount } from 'svelte';
	import { Tab } from '$models/Tab.js';

	let tabs = [
		new Tab('https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/addPrefix.js'),
		new Tab('https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/createPlugin.js')
	];

	export let widgetName = 'IDE';
	export let selected: Tab;

	let ideContent = selected.progress;
	let ready = false;
	let wrap = false;

	selected = tabs[0];

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

	onMount(() => {
		loadItems();
	});

	const loadItems = async () => {
		for (let i = 0; i < tabs.length; i++) {
			const response = await fetch(tabs[i].path);
			tabs[i].content = await response.text();
		}
		ready = true;
	};

	const handleInput = (e: Event) => {
		e.preventDefault();
		// if ((e as KeyboardEvent).repeat) {
		// 	return;
		// }
		if (selected.progress.length < selected.content.length) {
			selected.progress += selected.content[selected.progress.length];
			ideContent = selected.progress;
		} else {
			console.log('File complete');
		}
	};

	function onTabChange(tab: Tab) {
		if (selected == tab) return;
		selected = tab;
		ideContent = selected.progress;
		(document.querySelector('.ide-content') as HTMLElement)?.focus();
		console.log('changed!');
	}
</script>

<div class="widget-ide flew-grow relative flex min-h-96 flex-1 select-none flex-col rounded shadow-sm" style={cssVarStyles}>
	<div class="ide-tabs no-scrollbar absolute inline-flex h-12 w-full items-end self-start overflow-x-scroll rounded-t pt-2">
		<div class="ide-icon relative h-12 min-w-12 select-none border-0 pl-2 pr-3" />
		{#each tabs as tab}
			<button on:click={() => onTabChange(tab)} class:active={tab == selected} class="ide-tab shadow-0 relative h-10 min-w-48 max-w-64 pb-2 pl-4 pr-4 pt-2 text-sm">
				<p class="truncate text-left">{tab.name}</p>
			</button>
		{/each}
	</div>
	<textarea
		disabled={!ready}
		class="ide-content mt-12 flex-grow resize-none whitespace-nowrap p-4 font-mono outline-none"
		class:whitespace-nowrap={!wrap}
		on:dblclick={() => (wrap = !wrap)}
		on:keydown={handleInput}
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false"
		placeholder="New file">{ideContent}</textarea
	>
</div>

<style>
	/* IDE Windows_Notepad */

	.widget-ide {
		border: solid 1px var(--border-external, gray);
	}
	.widget-ide .ide-tabs {
		background-color: var(--bg-tabs);
		color: var(--text-tab);
	}
	.widget-ide .ide-tabs::before {
		content: '';
		background-color: var(--border-internal);
		position: absolute;
		width: 100%;
		left: 0px;
		bottom: 0px;
		height: 1px;
	}
	.widget-ide .ide-tabs .ide-icon {
		background-image: url('$lib/assets/icons/Notepad_Win11.svg');
		background-repeat: no-repeat;
		background-size: 30%;
		position: relative;
		background-position: center;
	}
	.widget-ide .ide-tabs .ide-tab {
		cursor: default;
		direction: rtl;
		border-top-left-radius: 0.375rem;
		border-top-right-radius: 0.375rem;
		background-color: var(--bg-tab-unactive);
		box-sizing: border-box;
		border-top: solid 1px var(--border-tab-unactive);
		border-left: solid 1px var(--border-tab-unactive);
		border-right: solid 1px var(--border-tab-unactive);
		border-bottom: solid 1px var(--border-internal);
	}
	.widget-ide .ide-tabs .ide-tab:hover {
		background-color: var(--bg-tab-hover);
		border-top: solid 1px var(--border-tab-hover);
		border-left: solid 1px var(--border-tab-hover);
		border-right: solid 1px var(--border-tab-hover);
		color: var(--text-tab-focus);
	}
	.widget-ide .ide-tabs .ide-tab:focus {
		background-color: var(--bg-tab-focus);
		border-top: solid 1px var(--border-tab-focus);
		border-left: solid 1px var(--border-tab-focus);
		border-right: solid 1px var(--border-tab-focus);
		color: var(--text-tab-focus);
	}
	.widget-ide .ide-tabs .ide-tab.active {
		cursor: default;
		background-color: var(--bg-tab-active);
		border-top: solid 1px var(--border-tab-active);
		border-left: solid 1px var(--border-tab-active);
		border-right: solid 1px var(--border-tab-active);
		border-bottom: solid 1px var(--bg-tab-active);
	}
	.widget-ide .ide-tabs .ide-tab.active > p {
		font-weight: 600;
	}
	.widget-ide .ide-tabs .ide-tab.active::before {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		left: -8px;
		bottom: -1px;
		border-bottom-right-radius: 0.375rem;
		border-bottom: solid 1px var(--border-internal);
		border-right: solid 1px var(--border-internal);
		z-index: 1000;
		box-shadow: 3px 3px 0 0 var(--bg-tab-active);
	}
	.widget-ide .ide-tabs .ide-tab.active::after {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		right: -8px;
		bottom: -1px;
		border-bottom-left-radius: 0.375rem;
		border-bottom: solid 1px var(--border-internal);
		border-left: solid 1px var(--border-internal);
		z-index: 1000;
		box-shadow: -3px 3px 0 0 var(--bg-tab-active);
	}
	.widget-ide .ide-content {
		background-color: var(--bg-input);
	}
</style>
