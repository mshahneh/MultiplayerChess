const colyseus = require('colyseus');
const customAlphabet = require('nanoid').customAlphabet;

exports.ChessRoom = class extends colyseus.Room {
    onCreate(_options){
        console.log('room created')
        const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 5);
        this.roomId = nanoid();

        this.maxClients = 4;

        // this.setState(new ShelemMatch(_options.has_joker));

        // this.onMessage('TablePosition', (client, message) => {
        //     this.match_handler.handleTablePosition(
        //         this.state,
        //         client.sessionId,
        //         message);
        //   });
    }

    _onJoin(client, options){
        console.log('Room ' + this.roomId + ': Client ' +
        client.sessionId + ' JOINED');

    }

    async onLeave(client, consented) {
        console.log('Room ' + this.roomId + ': Client ' +
        client.sessionId + ' LEFT');
    }

    onDispose(){
        console.log('Room ' + this.roomId + ' DESTROYED');
    }
}