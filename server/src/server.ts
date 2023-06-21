import { Logger } from "@logger";
import { Server, createServer } from "https";

const port: number = 3000;
const server: Server = createServer();
server.listen(port, async () => {
	console.log(`Server listening on port ${port}`);
});