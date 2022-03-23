import React, { Component } from "react";
import "./CSS/TeamSelection.scss";
import { connect } from "react-redux";
import {create_room, join_room} from "../Actions/GameActions";
// import ServerCommunication from "../Components/ServerCommunication"
import Seat from "../Components/Seat"
import Button from "@material-ui/core/Button/Button"


class TeamSelection extends Component {

    render() {
        let positions = [{name:'', is_ready:false}, {name:'', is_ready:false},
            {name:'', is_ready:false}, {name:'', is_ready:false}]
        for(let player in this.props.gameState.players) {
            let pos = this.props.gameState.players[player].position_at_table
            if(pos > 0) {
                positions[pos-1].name = this.props.gameState.players[player].name
                positions[pos-1].is_ready = this.props.gameState.players[player].ready
            }
        }
        // console.log(this.props.gameState, this.props.gameState.score_history[0])
        return <div id={"TeamSelection"}>
            {/*<pre>*/}
            {/*{JSON.stringify(this.props.gameState, null, "\t")}*/}
            {/*</pre>*/}
            {/*<pre>*/}
            {/*    {JSON.stringify(this.props.playerId, null, "\t")}*/}
            {/*</pre>*/}
            <div id={"team-seats"}>
                <p>Room Code: {this.props.room.id}</p>
                {/*<div className="seat" onClick={()=>this.props.room.send('TablePosition', {"position":1})}>*/}
                {/*    <p>{positions[0].name}</p>{positions[0].is_ready?<p>ready</p>:<p>not ready</p>}*/}
                {/*</div>*/}
                <Seat name={positions[0].name} isReady={positions[0].is_ready} onClick={()=>this.props.room.send('TablePosition', {"position":1})}/>
                <div className={"middle-seat"}>
                    <Seat name={positions[1].name} isReady={positions[1].is_ready} onClick={()=>this.props.room.send('TablePosition', {"position":2})}/>
                    <Seat name={positions[3].name} isReady={positions[3].is_ready} onClick={()=>this.props.room.send('TablePosition', {"position":4})}/>
                </div>
                <Seat name={positions[2].name} isReady={positions[2].is_ready} onClick={()=>this.props.room.send('TablePosition', {"position":3})}/>
                <Button id={"ready-button"} variant="contained" color="secondary"  onClick={()=>this.props.room.send('ReadyToPlay', {"ready":true})}>Ready</Button>
            </div>
            {/*<div className="ready" onClick={()=>this.props.room.send('ReadyToPlay', {"ready":true})}> Ready! </div>*/}
            {/*<ServerCommunication room = {this.props.room}/>*/}
        </div>
    }
}

const mapStateToProps = state => {
    // return {};
    return state.AppReducer
};

const mapDispatchToProps = dispatch => {
    return {
        create_room:(client, room) => dispatch(create_room(client, room)),
        join_room: (client, room_id, room) => dispatch(join_room(client, room_id, room))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamSelection);