import { Server, createServer } from "http";

const port: number = 3000;
const server: Server = createServer();
server.listen(port, async () => {
	console.log(`Server listening on port ${port}`);
});
