import express from "express";
import { Server } from "socket.io";


const PORT = process.env.PORT || 3000;
const ADMIN = 'Admin';
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Connection', 'keep-alive');
    next();
});

app.use(express.static("public"));

app.get('/*', (req, res) => {
    res.redirect('https://chezz-game-socketio-project.onrender.com');
});


const expressServer = app.listen(PORT);
// expressServer.keepAliveTimeout(30 * 60 * 1000);

const io = new Server(expressServer, {
    // Configure Socket.IO options here
    pingInterval: 20000, // Interval for the server to send ping packets to clients (in ms)
    pingTimeout: 5000, // Timeout for clients to respond to the ping packets (in ms)
});

// const io = new Server(expressServer, {
//     cors: {
//         origin: process.env.NODE_ENV === 'production' ? false :
//             ['http://localhost:5500', 'http://127.0.0.1:5500']
//     }
// });

// socket 

const ROOMSTATE = {
    rooms: []
}

const playerColors = {
    list: ['#ef476f', '#06d6a0', '#00b4d8', '#f77f00', '#fcbf49', '#9f86e0', '#2ec4b6', '#c98bb9', '#90e0ef', '#a09abc']
}

const alpha = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

const generater = {
    getCODE: () => {
        let CODE = '';
        for (let i = 0; i < 6; i++) {
            let index = Math.floor(Math.random() * 26);
            CODE += `${alpha[index]}`;
        }
        return CODE;
    },
    getCOLOR: (color) => {
        if (color == 'Random')
            color = Math.random() > 0.5 ? 'black' : 'white';

        return {
            color1: color,
            color2: color != 'black' ? 'black' : 'white'
        }
    }
}

io.on('connection', socket => {
    // console.log("connedted");
    socket.alive = true;
    console.log(socket.id + ' connected at io');
    // socket.setTimeout(2 * 60 * 1000);

    socket.on('createRoom', ({ host, matchTime, myColor }) => {

        // remove from other rooms
        //------??--------

        const room = activateRoom(matchTime, myColor);
        const user = activateUser(socket.id, host, room);
        room.P1 = user;

        // join room
        socket.join(room.CODE);

        // to host
        socket.emit('roomPage', room);

        // start ping
        socket.emit('ping');
    });

    socket.on('joinRoom', ({ name, joinRoomID }) => {

        // remove from other rooms
        //------??--------

        const room = getRoom(joinRoomID);
        if (!room) return;

        const user = activateUser(socket.id, name, room);

        // join room
        socket.join(room.CODE);

        // to user
        socket.emit('roomPage', room);
        socket.broadcast.to(room.CODE).emit('updateRoom', room);

        // start ping
        socket.emit('ping');
    });

    socket.on('pong', () => {
        socket.alive = true;
        setTimeout(() => {
            socket.alive = false;
            socket.emit('ping');
            setTimeout(() => {
                if (!socket.alive) {
                    // do something for disconnection
                }
            }, 3000);
        }, 5000);
    });

    socket.on('startGameChat', p_2 => {
        const p2 = getUser(p_2);
        if (p2) {
            const room = getRoom(p2.roomCODE);
            room.gameStatus = true;
            room.P2 = p2;
            io.to(p2.roomCODE).emit('openGameChatBox', room);
        }
    });

    socket.on('message', ({ text }) => {
        const user = getUser(socket.id);
        if (user) {
            io.to(user.roomCODE).emit('message', buildMsg(user, text));
        }
    });

    socket.on('sendMove', ({ fromId, toId }) => {
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.roomCODE).emit('recieveMove', { fromId, toId });
        }
    });

    socket.on('exitRoom', () => {
        const user = getUser(socket.id);
        if (!user) return;
        const room = getRoom(user.roomCODE);

        if (user && room) {
            if (room.gameStatus && room.P1 && room.P2) {
                if (user.id == room.P1.id || user.id == room.P2.id) {
                    room.gameStatus = false;
                    io.to(room.CODE).emit('endGame', { exitedUserId: socket.id, room });
                }
            }

            userLeavesRoom(socket.id);

            if (!room.status) {
                room.CODE = "CLOSED";
            }
            socket.broadcast.to(user.roomCODE).emit('updateRoom', room);
        } else
            userLeavesRoom(socket.id);
    });

    socket.on('endGameStatus', () => {
        const user = getUser(socket.id);
        if (user) {
            const room = getRoom(user.roomCODE);
            room && (room.gameStatus = false);
        }
    });

    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        if (!user) return;
        const room = getRoom(user.roomCODE);

        if (user && room) {
            if (room.gameStatus && room.P1 && room.P2) {
                if (user.id == room.P1.id || user.id == room.P2.id) {
                    room.gameStatus = false;
                    socket.to(room.CODE).emit('endGame', { exitedUserId: socket.id, room });
                }
            }

            userLeavesRoom(socket.id);

            if (!room.status) {
                room.CODE = "CLOSED";
            }
            console.log(socket.id + " disconnected");
            socket.broadcast.to(user.roomCODE).emit('updateRoom', room);
        } else
            userLeavesRoom(socket.id);
    });

});


// important methods

const buildMsg = (user, text) => {
    return {
        user, text,
        time: new Intl.DateTimeFormat('en-US', {
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        }).format(new Date())
    }
}

function activateRoom(matchTime, P1Color) {
    const colors = generater.getCOLOR(P1Color);
    const room = {
        gameStatus: false,
        status: true,
        CODE: generater.getCODE(),
        matchTime,
        P1: null,
        P2: null,
        P1Color: colors.color1,
        P2Color: colors.color2,
        users: [],
        colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    ROOMSTATE.rooms.push(room);
    return room;
}

function activateUser(id, name, room) {
    if (room.users.length > 9) return;
    const color = playerColors.list[room.colors.shift()];
    const user = { id, name, roomCODE: room.CODE, color };
    room.users = [
        ...room.users.filter((R) => R.CODE != room.CODE), user
    ]
    return user;
}

function getRoom(CODE) {
    return ROOMSTATE.rooms.find((room) => room.CODE == CODE);
}

function userLeavesRoom(id) {
    const user = getUser(id);
    if (!user) return null;
    const room = getRoom(user.roomCODE);
    if (room) {
        room.colors.push(user.color);
        room.users = room.users.filter(U => U.id != id);
        if (room.P1.id == id || room.P2 && room.P2.id == id) {
            room.users = [];
            terminateRoom(room);
        }
    }
}

function getUser(id) {
    for (let room of ROOMSTATE.rooms) {
        for (let user of room.users) {
            if (user.id == id) return user;
        }
    }
    return null;
}

function terminateRoom(room) {
    room.status = false;
    ROOMSTATE.rooms = [
        ...ROOMSTATE.rooms.filter(R => R.CODE != room.CODE)
    ];
}