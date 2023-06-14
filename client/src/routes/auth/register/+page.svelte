<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<form method="post" use:enhance>
	<input name="username" type="text" placeholder="username" />
	<input name="password" type="password" placeholder="password" />
	<input name="confirmPassword" type="password" placeholder="confirm password" />
	<button type="submit">Register</button>
</form>

{#if form}
	{#if form.error}
		<p>{form.error}</p>
		<p>{form.data}</p>
	{/if}
{/if}