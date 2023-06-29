<script lang="ts">
	import { user } from '$lib/userStore';
    import Icon from "$lib/components/icon.svelte";
</script>

<div class="flex items-center justify-between p-2 bg-secondary">
	<Icon className="hidden md:block fill-text" icon="online card game"/>
	<div class="flex w-full p-1 space-x-2 rounded-md md:w-1/3 bg-background">
		<Icon icon="account" className="fill-text "/>
		<input type="text" name="username" bind:value={$user.name} class="w-full text-xl font-bold outline-none bg-inherit" />
	</div>
</div>