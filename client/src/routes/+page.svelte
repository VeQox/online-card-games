<script lang="ts">
	import { onMount } from "svelte";


    onMount(() => {
        let ws = new WebSocket("ws://0.0.0.0:3000");
        ws.onopen = () => {
            console.log("connected");
        };
        ws.onclose = () => {
            console.log("disconnected");
        };
    });
</script>