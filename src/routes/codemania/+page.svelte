<script lang="ts">
	import JobOffer from './JobOffer.svelte';

	function move(element: Element) {
		return {
			destroy() {}
		};
	}

	function resize(element: HTMLElement) {
		const grabber = document.querySelector('.grabber');

		let minWidth = 600; // screen 20%
		let maxWidth = 900; // screen halfsize -

		let active: EventTarget | null;
		let initialRect = {
			width: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};

		let initialPos = { x: 0, y: 0 };

		if (grabber != null) {
			grabber.addEventListener('mousedown', onMousedown);
		}

		function onMousedown(event: Event): Boolean {
			active = event.target;
			const rect = element.getBoundingClientRect();
			const parent = element.parentElement?.getBoundingClientRect();
			if (parent != null && event instanceof MouseEvent) {
				console.log({ rect, parent });

				initialRect.width = rect.width;
				initialRect.height = rect.height;
				initialRect.left = rect.left - parent.left;
				initialRect.right = parent.right - rect.right;
				initialRect.top = rect.top - parent.top;
				initialRect.bottom = parent.bottom - rect.bottom;

				initialPos.x = event?.pageX;
				console.log(initialPos.x);
			}

			return true;
		}

		function onMouseup(event: MouseEvent) {
			if (!active) return;

			active = null;
			initialRect = {
				width: 0,
				height: 0,
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			};
			initialPos = { x: 0, y: 0 };
		}

		function onMove(event: MouseEvent) {
			if (!active) return;

			let delta;

			if (event?.pageX > minWidth && event?.pageX < maxWidth) {
				delta = event.pageX - initialPos.x;
				element.style.width = `${initialRect.width + delta}px`;
			}
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

	let grabber = true;
</script>

<svelte:head>
	<title>Codemania</title>
	<meta name="description" content="" />
</svelte:head>

<div class="flex h-screen bg-slate-300 font-sans">
	<div class="hidden w-[30rem] flex-none bg-slate-200 p-4 lg:flex" use:move use:resize>Col 1</div>
	<div class="grabber right hidden flex-col content-center justify-center lg:flex">
		<div class="cursor-col-resize select-none p-1">|</div>
	</div>
	<div class="flex flex-1 flex-col overflow-hidden bg-slate-200 p-4">Col 2</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.500);
	}
</style>
