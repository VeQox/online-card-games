import { digestMessage } from "$lib/utils";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";

export const actions : Actions = {
	default: async ({ cookies, request, fetch }) => {
		const formData = await request.formData();

		const username = formData.get("username") as string;
		const password = await digestMessage(formData.get("password") as string);
		const confirmPassword = await digestMessage(formData.get("confirmPassword") as string);

		if (password != confirmPassword) {
			return {
				error: true,
				data: "passwords dont match"
			};
		}

		const response = await fetch("http://localhost:3000/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			const { name, value, options } = await response.json();
			cookies.set(name, value, options);
			return { error: false };
		}

		return {
			error: true,
			data: await response.text()
		};
	}
};
