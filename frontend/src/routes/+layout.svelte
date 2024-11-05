<script>
	import '../app.css';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<ParaglideJS {i18n}>
	<header>
		<AppBar>
			Tasting Organizer
		</AppBar>
	</header>
	<slot></slot>
</ParaglideJS>
