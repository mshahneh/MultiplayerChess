const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const monitor = require('@colyseus/monitor').monitor;
const matchMaker = require("colyseus").matchMaker;
// const socialRoutes = require("@colyseus/social/express").default;

const ChessRoom = require('./src/rooms/chess_room').ChessRoom;

const port = process.env.PORT || 2567;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname+'/build'));

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
});

// register your room handlers
gameServer.define('chess_room', ChessRoom);

app.get('/', function (req, res) {
  res.send('bye')
  // matchMaker.createRoom("chess_room", { mode: "duo" }).then(room => {
  //   console.log(room)
  //   res.send('hello')
  // })
})

app.get('/getrooms', function (req, res) {
  console.log("here")
  matchMaker.query({ name: "chess_room"}).then(rooms=>
  {
    console.log(rooms)
    res.send(rooms)
  })
})
/*
  [
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  ]
*/

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the require statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`);
