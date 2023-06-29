<script lang="ts">
	import "../app.css";
</script>
	
<slot />

<style lang="postcss">
	:global(html) {
		font-family: "Noto Sans", sans-serif;
		color: theme(colors.text);
		background-color: theme(colors.background);
	}
</style>
