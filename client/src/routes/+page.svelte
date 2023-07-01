<script lang="ts">
	import { user } from '$lib/userStore';
    import Icon from "$lib/components/icon.svelte";
	import type { Room } from '$lib/types/room';
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	export let data : PageServerData;
	$: rooms = data.rooms;
	let newRoom = {
		name: `${$user.name}'s room`,
		type: undefined,
		public: true
	}
	let filter: string;
	$: filteredRooms = rooms.filter(room => room);
	$: newRoom;
	let code: string;

	const fetchRooms = async() => {
		const response = await fetch("http://localhost:3000/rooms/?public=true", {
			method: "GET"
		});

		rooms = await response.json() as Room[];
	}

	const createRoom = async() => {
		if(newRoom.type === "Game Type") return;

		const response = await fetch("http://localhost:3000/rooms/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user: {
					id: $user.id,
					name: $user.name
				},
				name: newRoom.name,
				type: newRoom.type,
				public: newRoom.public
			})
		});
		
		if(response.status !== 201) return;	

		const id = (await response.json()).id as string;
		joinRoom(id)
	}

	const joinRoom = (id?: string) => {
		if(!id) {
			if(!code) return;
			id = code;
		}

		window.location.href = `/${id}`;
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between p-2 rounded-md bg-secondary">
		<Icon className="hidden md:block fill-text" icon="online card game"/>
		<div class="flex w-full p-1 space-x-2 rounded-md md:w-1/3 bg-background">
			<Icon icon="account" className="fill-text "/>
			<input type="text" bind:value={$user.name} class="w-full text-xl font-bold outline-none bg-inherit" />
		</div>
	</div>

	<div class="flex justify-center">
		<div class="w-full space-y-4 md:w-2/3">
			<form on:submit={() => joinRoom()} class="flex flex-col justify-center p-2 space-y-2 rounded-md bg-secondary">
				<p class="text-2xl font-bold text-center">Join Private Room</p>
				<div class="flex items-center space-x-2">
					<label for="code" class="text-xl font-bold">CODE</label>
					<input bind:value={code} type="text" class="w-full p-2 text-xl rounded-md outline-none bg-background">
					<button type="submit" class="w-1/4 p-2 text-xl font-bold rounded-md bg-primary-dark text-background hover:bg-primary-darker">Join</button>
				</div>
			</form>

			<form on:submit={createRoom} class="flex flex-col justify-center p-2 space-y-2 rounded-md bg-secondary">
				<p class="text-2xl font-bold text-center">Create a new Room</p>
				<input bind:value={newRoom.name} type="text" class="w-full p-2 text-xl rounded-md outline-none bg-background">
				<select bind:value={newRoom.type} class="p-2 rounded-md bg-background">
					<option disabled selected>Game Type</option>
					<option value="Thirty One">Thirty One</option>
					<option value="Poker">Poker</option>
					<option value="Oh Hell">Oh Hell</option>
				</select>
				<label class="flex items-center space-x-2 cursor-pointer">
					<div class="text-xl font-bold">
						Public
					</div>
					<div class="relative">
						<input on:change={() => newRoom.public = !newRoom.public} value={newRoom.public} type="checkbox" class="sr-only">
						<div class="block h-8 rounded-full bg-background w-14"></div>
						<div class="absolute w-6 h-6 transition rounded-full bg-accent dot left-1 top-1"></div>
					</div>
				</label>
				<button type="submit" class="w-full p-2 text-xl font-bold rounded-md bg-primary-dark text-background hover:bg-primary-darker">Create Room</button>
			</form>

			<div class="flex flex-col justify-center p-2 space-y-2 rounded-md bg-secondary">
				<p class="w-full text-2xl font-bold text-center">Public Rooms</p>
				<div class="flex items-center"> 
					<input bind:value={filter} placeholder="filter" type="text" class="w-full col-span-5 p-2 mr-2 text-xl rounded-md outline-none bg-background placeholder:text-accent">
					<button on:click={() => fetchRooms()} class="w-1/4 p-2 text-xl font-bold rounded-md bg-primary-dark text-background hover:bg-primary-darker">Refresh</button>	
				</div>
				<div class="flex flex-col space-y-2">
					{#if rooms }
						{#if rooms.length === 0}
						<div class="flex items-center justify-center h-10 rounded-md bg-background">
							<p class="text-xl font-bold text-center text-accent">No Public Rooms</p>
						</div>
						{/if}
					{/if}
					{#if rooms }
						{#each filteredRooms as room}
							<div class="grid grid-cols-6 rounded-md">
								<p class="col-span-2 p-2 bg-background rounded-l-md">{room.name}</p>
								<p class="col-span-2 p-2 text-center bg-background">{room.type}</p>
								<p class="p-2 mr-2 text-center bg-background rounded-r-md">{room.users}</p>
								<button on:click={() => joinRoom(room.id)} class="w-full font-bold rounded-md text-md bg-primary-dark text-background hover:bg-primary-darker">Join</button>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>



<style lang="postcss">
	input:checked ~ .dot {
		transform: translateX(100%);
		background-color: theme(colors.primary-dark);
	}
</style>