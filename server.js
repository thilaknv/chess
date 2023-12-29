import express from "express";
import { Server } from "socket.io";



const PORT = process.env.PORT || 3000;
const ADMIN = 'Admin';
const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.html");
});

const expressServer = app.listen(PORT, (req, res) => {
    console.log(`Server running at port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false :
            ['http://localhost:5500', 'http://127.0.0.1:5500']
    }
});

const ROOMSTATE = {
    rooms: []
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
        socket.broadcast.to(room.CODE).emit('updateRoomPage', room);
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

    socket.on('sendMove', ({fromId, toId}) => {
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.roomCODE).emit('recieveMove', {fromId, toId});
        }
    });

    socket.on('disconnect', () => {
        const UR = userLeavesRoom(socket.id);
        if (UR && UR.user) {
            if (UR.room) {
                if (!UR.room.status) {
                    UR.room.CODE = "CLOSED";
                }
                socket.broadcast.to(UR.user.roomCODE).emit('updateRoomPage', UR.room);
            }
        }
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
        users: []
    }
    ROOMSTATE.rooms.push(room);
    return room;
}

function activateUser(id, name, room) {
    const user = { id, name, roomCODE: room.CODE };
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
        room.users = room.users.filter(U => U.id != id);
        if (room.P1.id == id) {
            room.users = [];
            room.gameStatus = false;
            terminateRoom(room);
        }
    }
    return { user, room };
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
