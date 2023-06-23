<script lang="ts">
	import { enhance } from "$app/forms";

	export let form;
</script>

<form method="post" use:enhance>
	<input name="username" type="text" placeholder="username" />
	<input name="password" type="password" placeholder="password" />
	<button type="submit">Login</button>
</form>

<p>{form?.message}</p>
