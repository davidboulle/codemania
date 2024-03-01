<script lang="ts">
	import { onMount } from 'svelte';
	import { ProjectFile } from '$models/ProjectFile.js';

	let tabs = [
		new ProjectFile('https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/addPrefix.js'),
		new ProjectFile('https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/createPlugin.js')
	];

	export let widgetName = 'IDE';
	export let selected: ProjectFile;

	let ideContent = '';
	let ideContentNext = '';
	let ready = false;
	let wrap = true;
	let animations: {
		key: String;
		error: boolean;
	}[] = [];

	let chainTimer: ReturnType<typeof setTimeout>;
	let chainTimerStarted = false;
	let chainAnimation = false;
	let chainSize = 0;
	let chainAnimationContainer: Element;
	let chainAnimationValue: Element;

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
		'text-tab-focus': 'rgba(0, 0, 0, 0.7)',
		'text-light': '#cbd5e1'
	};

	$: cssVarStyles = Object.entries(ideStyle)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(() => {
		loadItems();
		startChainTimer();
		let el1 = document.querySelector('.ide-animations');
		if (el1 != null) {
			chainAnimationContainer = el1;
		}
		let el2 = document.querySelector('.anim-chain');
		if (el2 != null) {
			chainAnimationValue = el2;
		}
	});

	async function startChainTimer() {
		window.clearTimeout(chainTimer);
		if (chainTimerStarted) {
			// animate

			// chainAnimationValue.appendChild
			// var p = document.createElement('p'),
			// p.className = 'block';
			// jDiv.className = 'block-2';
			// iDiv.appendChild(jDiv);
			// document.getElementsByTagName('body')[0].appendChild(iDiv);

			// chainAnimationValue.classList.add('chain-pulse');
			// await tick();
			// chainAnimationValue.classList.remove('chain-pulse');

			chainAnimation = chainAnimation;
		} else {
			chainTimerStarted = true;
		}
		chainTimer = setTimeout(stopChainTimer, 3000);
	}

	function stopChainTimer() {
		chainSize = 0;
		animations = [];
		clearTimeout(chainTimer);
		chainTimerStarted = false;
	}

	const loadItems = async () => {
		for (let i = 0; i < tabs.length; i++) {
			const response = await fetch(tabs[i].path);
			tabs[i].content = await response.text();
			tabs[i].progressNext += tabs[i].getNextWord(tabs[i].progress.length);
		}
		ideContent = selected.progress;
		ideContentNext = selected.progressNext;
		ready = true;
	};

	const onKeyDown = (e: Event) => {
		let event = e as KeyboardEvent;
		let cancel = false;

		//if (event.repeat) cancel = true;
		if (event.key == 'Backspace') cancel = true; // backspace
		if (event.key == 'Tab') cancel = true; // tab
		if (event.keyCode >= 33 && event.keyCode <= 47) cancel = true; // arrows & misc keys

		if (cancel) {
			e.preventDefault();
			console.log('Prevent');
		}
	};

	const onKeyPress = (e: Event) => {
		console.log('KeyPress');
		e.preventDefault();
		let event = e as KeyboardEvent;

		if (selected.progress.length < selected.content.length) {
			selected.progress += selected.content[selected.progress.length];
			let char = event.key;
			let charDisplay = event.key;
			if (event.key == ' ') {
				charDisplay = '⎵';
			} else if (event.key == 'Enter') {
				char = '\n';
				charDisplay = '↲';
			}
			if (selected.isSameChar(char)) {
				chainSize++;
				animations.push({
					key: charDisplay,
					error: false
				});
				animations = animations;
				startChainTimer();
			} else {
				if (chainTimerStarted) {
					stopChainTimer();
				}
				animations.push({
					key: charDisplay,
					error: true
				});
				animations = animations;
			}
			if (selected.progress == selected.progressNext) {
				selected.progressNext += selected.getNextWord(selected.progress.length);
			}
		} else {
			selected.progress = '';
			selected.progressNext = '';
		}

		ideContent = selected.progress;
		ideContentNext = selected.progressNext;
	};

	function onTabChange(tab: ProjectFile) {
		if (selected == tab) return;
		selected = tab;
		ideContent = selected.progress;
		ideContentNext = selected.progressNext;
		(document.querySelector('.ide-content') as HTMLElement)?.focus();
		console.log('changed!');
	}

	let nextTreshold = 15;
</script>

<div class="widget-ide flew-grow relative flex min-h-96 flex-1 select-none flex-col rounded shadow-sm" style={cssVarStyles}>
	<div class="ide-tabs no-scrollbar absolute inline-flex h-12 w-full items-end self-start overflow-x-scroll rounded-t pt-2">
		<div on:dblclick={() => (wrap = !wrap)} class="ide-icon relative h-12 min-w-12 select-none border-0 pl-2 pr-3" />
		{#each tabs as tab}
			<button on:click={() => onTabChange(tab)} class:active={tab == selected} class="ide-tab shadow-0 relative h-10 min-w-48 max-w-64 pb-2 pl-4 pr-4 pt-2 text-sm">
				<p class="truncate text-left">{tab.name}</p>
			</button>
		{/each}
	</div>
	<textarea
		disabled={!ready}
		class="ide-content z-20 mt-12 flex-grow resize-none bg-transparent p-4 font-mono outline-none"
		on:keypress={onKeyPress}
		on:keydown={onKeyDown}
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false">{ideContent}</textarea
	>
	<textarea readonly class="ide-content-next absolute bottom-0 left-0 right-0 top-0 z-10 mt-12 flex-grow resize-none p-4 font-mono outline-none" class:whitespace-nowrap={!wrap} spellcheck="false"
		>{ideContentNext}</textarea
	>
	<div class="ide-animations absolute z-10 m-[50%] flex h-0 w-0 items-center justify-center">
		<div class="anim-chain chain-pulse relative mt-10 w-auto whitespace-nowrap text-center">Chain × {chainSize}</div>
		{#each animations as anim}
			<p class:error={anim.error} class="absolute leading-zero">{anim.key}</p>
		{/each}
	</div>
</div>

<style>
	/* IDE Windows_Notepad */

	.widget-ide {
		border: solid 1px var(--border-external, gray);
		background-color: rgba(0, 0, 0, 0);
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
	.widget-ide .ide-content-next {
		background-color: var(--bg-input);
		color: var(--text-light);
	}
	.widget-ide .ide-animations .anim-chain {
		color: var(--text-light);
	}
	.widget-ide .ide-animations p {
		color: var(--text-light);
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) forwards 1;
	}
	.widget-ide .ide-animations p.error {
		color: rgba(256, 0, 0, 0.3);
	}

	.chain-pulse {
		animation: pulse 3s forwards 1;
	}

	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		75%,
		100% {
			transform: scale(20);
			opacity: 0;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1.1);
		}
		20% {
			transform: scale(1);
			opacity: 1;
		}
		75%,
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
