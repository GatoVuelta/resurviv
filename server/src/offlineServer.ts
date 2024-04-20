import { type Game } from "../../client/src/game";
import { MsgStream, MsgType } from "../../shared/net";
import { AbstractServer, ServerSocket, type PlayerContainer } from "./abstractServer";
import { Config } from "./config";

export class OfflineSocket extends ServerSocket {
    constructor(
        public game: Game,
        public data: PlayerContainer) {
        super();
        this.game = game;
        this.data = data;
    }

    send(message: ArrayBuffer | Uint8Array): void {
        const msgStream = new MsgStream(message);
        while (true) {
            const type = msgStream.deserializeMsgType();
            if (type == MsgType.None) {
                break;
            }
            this.game.onMsg(type, msgStream.getStream());
        }
    }

    close() { }
}

export class OfflineServer extends AbstractServer {
    constructor(public game: Game) {
        super();

        this.init();

        setInterval(() => {
            this.tick();
        }, 1000 / Config.tps);
    }
}
