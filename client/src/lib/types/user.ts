export class User {
    constructor(public name: string, public id: string, public ws?: WebSocket) {}
    
    static fromJSON(json: string) {
        let {name, id} = JSON.parse(json);
        return new User(name, id);
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            id: this.id
        });
    }
}