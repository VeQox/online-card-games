<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

	$: canSubmit = false;

	const validateForm = () => {
		let username = (formElement?.elements.namedItem("username") as HTMLInputElement).value;
		let password = (formElement?.elements.namedItem("password") as HTMLInputElement).value;
		let confirmPassword = (formElement?.elements.namedItem("confirm password") as HTMLInputElement).value;

		canSubmit = validUsername(username) && validPassword(password) && validConfirmPassword(password, confirmPassword);
	};

	const validUsername = (username: string) => {
		return username.length > 0 && username.length < 256;
	};

	const validPassword = (password: string) => {
		return password.length > 0 && password.length < 256;
	};

	const validConfirmPassword = (password: string, confirmPassword: string) => {
		return password === confirmPassword;
	};

	let formElement: HTMLFormElement;

	export let form: ActionData;
</script>

<div class="flex items-center justify-center w-full h-screen">
	<div class="flex justify-center w-full rounded-md md:w-1/2 bg-secondary md:block">
		<div class="w-full p-8">
			<h1 class="mb-4 text-2xl font-bold text-center">Create an account</h1>
			<form bind:this={formElement} method="post" use:enhance class="flex flex-col items-center justify-center w-full mb-4 space-y-4">
				<div class="w-full space-y-1">
					<label for="username" class="text-sm font-bold">USERNAME</label>
					<input on:input={validateForm} type="text" id="username" name="username" class="w-full p-2 rounded-md outline-none bg-background" />
					{#if form && form.field === "username"}
						<p class="text-sm text-red-500">{form.message}</p>
					{/if}
				</div>
				<div class="w-full space-y-1">
					<label for="password" class="text-sm font-bold">PASSWORD</label>
					<input on:input={validateForm} type="password" id="password" name="password" class="w-full p-2 rounded-md outline-none bg-background" />
				</div>
				<div class="w-full space-y-1">
					<label for="confirm password" class="text-sm font-bold">CONFIRM PASSWORD</label>
					<input
						on:input={validateForm}
						type="password"
						id="confirm password"
						name="confirm password"
						class="w-full p-2 rounded-md outline-none bg-background"
					/>
					{#if form && form.field === "confirm password"}
						<p class="text-sm text-red-500">{form.message}</p>
					{/if}
				</div>
				<button class="w-full p-2 rounded-md bg-primary text-background disabled:bg-primary-darker" disabled={!canSubmit}>Register</button>
			</form>
			<a href="/auth/login" class="mt-8 text-primary-dark">Already have an account?</a>
		</div>
	</div>
</div>
