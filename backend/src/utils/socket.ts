import { Server, Socket } from "socket.io";

let io:Server;

export function initSocket(server: any):void {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", socket => {
        console.log("Socket, socket.id");
        
    })
}

export function getIo():Server {
    return io;
}