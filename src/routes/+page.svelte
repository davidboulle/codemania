<script lang="ts">
	import WidgetIde from '$components/WidgetIde.svelte';
	import WidgetManagement from '$components/WidgetManagement.svelte';
	import WidgetStats from '$components/WidgetStats.svelte';
	import resolveConfig from 'tailwindcss/resolveConfig';
	import tailwindConfig from './../../tailwind.config.js';
	import { onMount } from 'svelte';
	import { Tab } from '../models/Tab';

	const twConfig = resolveConfig(tailwindConfig);

	let breakpoint = parseInt(twConfig.theme.screens.md.slice(0, -2));

	onMount(() => {
		let element: HTMLElement | null = document.querySelector('#column-1');
		if (element != null) {
			element.style.width = '';
		}
		widescreen = windowWidth > breakpoint;
		resizeValue = windowWidth / 2;
		resizeValuePercent = resizeValue / windowWidth;
	});

	let resizeValue = 0;
	let resizeValuePercent = 0;

	let swapped = false;
	let widescreen = true;

	let windowWidth = 0;
	let windowHeight = 0;

	$: minColumn1Width = windowWidth / 3; // 33%
	$: maxColumn1Width = (windowWidth / 3) * 2; // 66%

	function move(element: Element) {
		return { destroy() {} };
	}

	function resize(element: HTMLElement) {
		const resizer = document.querySelector('.resizer');
		let active: EventTarget | null;
		let initialWidth = 0;
		let initialPos = 0;

		if (resizer != null) {
			resizer.addEventListener('mousedown', onMousedown);
		}

		function onMousedown(event: Event): Boolean {
			active = event.target;
			const rect = element.getBoundingClientRect();
			const parent = element.parentElement?.getBoundingClientRect();
			if (parent != null && event instanceof MouseEvent) {
				initialWidth = rect.width;
				initialPos = event?.pageX;
			}

			return true;
		}

		function onMouseup(event: MouseEvent) {
			if (!active) return;
			active = null;
			initialWidth = 0;
			initialPos = 0;
		}

		function onMove(event: MouseEvent) {
			if (!active) return;
			if (resizer == null) return;
			let delta = event.pageX - initialPos;
			let grabberW = resizer.getBoundingClientRect().width;
			let size = event.pageX - grabberW;

			if (size >= minColumn1Width && size <= maxColumn1Width) {
				element.style.width = `${initialWidth + delta}px`;
				resizeValue = initialWidth + delta;
			} else if (size > maxColumn1Width) {
				element.style.width = `${maxColumn1Width}px`;
				resizeValue = minColumn1Width;
			} else {
				element.style.width = `${minColumn1Width}px`;
				resizeValue = maxColumn1Width;
			}
			resizeValuePercent = resizeValue / windowWidth;
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onMouseup);

		return {
			destroy() {
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mousemove', onMousedown);
			}
		};
	}

	function resetColumnsSize() {
		let element: HTMLElement | null = document.querySelector('#column-1');
		const resizer = document.querySelector('.resizer');
		let resizerW = resizer?.getBoundingClientRect().width;
		if (element != null && resizerW != null) {
			if (element.style.width == '') {
				let main = document.querySelector('#container-main');
				if (main != null) {
					swapped = !swapped;
					console.log('Swapped columns.');
				}
			} else {
				element.style.width = '';
			}
		}
	}

	function onWindowResize() {
		let element: HTMLElement | null = document.querySelector('#column-1');
		if (element == null) return;
		if (element.style.width != '' && windowWidth <= breakpoint) {
			element.style.width = '';
		} else if (element.style.width == '' && windowWidth >= breakpoint) {
			element.style.width = `${resizeValue}px`;
		}

		if (windowWidth >= breakpoint) {
			element.style.width = `${windowWidth * (1 - resizeValuePercent)}px`;
		}

		if (typeof windowWidth !== 'undefined' && windowWidth > breakpoint) {
			widescreen = true;
		} else {
			widescreen = false;
		}
	}

	let selected: Tab = new Tab('');
</script>

<svelte:head>
	<title>CODEMANIA — {selected.name}</title>
	<meta name="description" content="" />
</svelte:head>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} on:resize={onWindowResize} />

<div id="container-main" class="flex min-h-screen w-full min-w-64 select-none flex-col gap-2 overflow-hidden bg-slate-200 p-2 font-sans md:h-screen md:flex-row md:gap-0">
	<!-- Column 1 -->
	<div id="column-1" class="flex w-full flex-col gap-2 md:w-[50%]" use:move use:resize>
		{#if widescreen && swapped}
			<WidgetIde bind:selected />
		{:else}
			<WidgetStats />
			<WidgetManagement />
		{/if}
	</div>

	<!-- Divider -->
	<div class="hidden min-h-96 w-2 flex-col justify-between text-slate-400 md:flex">
		<button on:dblclick={resetColumnsSize} class="resizer flex flex-1 cursor-col-resize items-center justify-center text-center">•</button>
	</div>

	<!-- Column 2 -->
	<div id="column-2" class="flex w-full flex-1 flex-col gap-2">
		{#if widescreen && swapped}
			<WidgetStats />
			<WidgetManagement />
		{:else}
			<WidgetIde bind:selected />
		{/if}
	</div>
</div>
