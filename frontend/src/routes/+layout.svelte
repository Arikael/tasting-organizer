<script>
	import '../app.css';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<ParaglideJS {i18n}>
	<header class="sticky top-0 z-10">
		<AppBar>
			Tasting Organizer
		</AppBar>
	</header>
	<main class="p-4">
		<slot></slot>
	</main>
</ParaglideJS>
