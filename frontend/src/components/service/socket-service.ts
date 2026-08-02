import { io, Socket } from "socket.io-client";

export type InventoryUpdatedData = {
    idProduct: number;
    idSale: number;
    idEvent: number | null;
    quantitySold: number;
    stockBefore: number;
    stockAfter: number;
    movementType: string;
};





class SocketService {

    private socket: Socket;
    private listenersRegistered = false

    public constructor() {
        this.socket = io("http://localhost:4000"), {
            autoConnect: false,
            transports: ["websocket", "poling"]
        };
    }

    public connect(): void {
        if (!this.listenersRegistered) {

            this.socket.on("connect", () => {
                console.log("Socket connected: ", this.socket.id);
            })
            this.socket.on("disconnect", () => {
                console.log("Socket disconnected");

            })

            this.socket.on("connect_error", error => {
                console.log("Socket connection error", error.message);

            });
            this.listenersRegistered = true;
        }
        if(this.socket.connected){
            this.socket.connect();
        }
    }
    public disconnect():void {
        this.socket.disconnect();
    }

    public onInventoryUpdated(callback:(data:InventoryUpdatedData) => void):void {
        this.socket.on("inventory-update", callback);
    }

    public offInventoryUpdated(callback:(data:InventoryUpdatedData)=> void):void {
        this.socket.off("inventory-updated", callback);
    }


}

export const socketService = new SocketService();