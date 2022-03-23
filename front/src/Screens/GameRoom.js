import React, { Component } from "react";
import "./CSS/GameRoom.scss";
import { connect } from "react-redux";
import {create_room, join_room} from "../Actions/GameActions";
// import ServerCommunication from "../Components/ServerCommunication"
import {decrypt, split_string} from "../Helpers/decryptor"
import Hand from "../Components/Hand";
import {extract_beautify_data} from "../Helpers/utils";
// import Card from "../Components/Card";
import Player from "../Components/Player"
import BetPanel from "../Components/BetPanel"
import ExtraCardPanel from "../Components/ExtraCardPanel"
import ScorePanel from "../Components/ScorePanel"
import PlayingTable from "../Components/PlayingTable";
import WinPanel from "../Components/WinPanel";

class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extra_cards : []
        };

        this.isBidding = this.isBidding.bind(this);
    }

    isBidding()
    {
        if(this.props.gameState.current_game.phase !== "bidding")
            return false;
        if(this.props.gameState.current_game.trump !== this.props.gameState.players[this.props.playerId].position_at_table)
            return false;
        return true;
    }

    playCard(suit, rank){
        // console.log("playCard", suit, rank, this.props.gameState, this.props.gameState.phase, this.props.gameState.phase === "EXTRA_CARDS", JSON.stringify(this.state), "".concat(suit,rank));
        if(this.props.gameState.current_game.phase === "EXTRA_CARDS")
        {
            if (this.props.gameState.current_game.trump !== this.props.gameState.players[this.props.playerId].position_at_table)
                return null;
            if(this.state.extra_cards.includes("".concat(suit,rank))) {
                let temp = this.state.extra_cards;
                temp = temp.filter(item => item !== "".concat(suit, rank));
                this.setState({extra_cards: temp});
            }
            else {
                let possible_extra = 4;
                if(this.props.gameState.has_joker)
                    possible_extra = 6;
                if(this.state.extra_cards.length < possible_extra) {
                    let temp = this.state.extra_cards;
                    temp.push("".concat(suit, rank));
                    // console.log(temp);
                    this.setState({extra_cards: temp});
                }
            }
        }
        else if(this.props.gameState.current_game.phase === "PLAY")
            this.props.room.send("PlayCard", {"suit":suit, "rank":rank});
    }

    placeBet(bid){
        // console.log(bid);
        this.props.room.send("Bidding", {"bid":bid});
    }

    submitExtraCards(){
        let possible_extra = 4;
        if(this.props.gameState.has_joker)
            possible_extra = 6;
        let cards = this.state.extra_cards.join('');
        let ranks = cards.split(/[A-Z]/).filter(i => i);
        let suits = cards.split(/[0-9]*/).filter(i => i);
        let res = [];
        for (let i = 0; i < ranks.length; i++)
        {
            res.push({"rank":ranks[i], "suit":suits[i]})
        }
        if(this.state.extra_cards.length === possible_extra) {
            this.props.room.send("ExtraCards", {"cards":res});
            this.setState({extra_cards: []});
        }
    }

    render() {
        // console.log("in render with ", this.props)
        let beautify_gameState = extract_beautify_data(this.props.gameState, this.props.playerId);
        // console.log("beatify", beautify_gameState);
        let center = <PlayingTable left={beautify_gameState.left.played_card}
                   right={beautify_gameState.right.played_card}
                   teammate={beautify_gameState.teammate.played_card}
                   player={beautify_gameState.player.played_card}
                   trump_suit={beautify_gameState.trump_suit}
                   played_cards = {this.props.gameState.current_game.played_cards}
        />;

        if(this.props.gameState.current_game.phase === "BIDDING")
            center = <BetPanel left={beautify_gameState.left.bid}
                               right={beautify_gameState.right.bid}
                               teammate={beautify_gameState.teammate.bid}
                               player={beautify_gameState.player.bid}
                               hasJoker={beautify_gameState.has_joker}
                               placeBet={this.placeBet.bind(this)}
                               canBet={beautify_gameState.player.bid !== -1 && beautify_gameState.player.isTurn}/>;

        if(this.props.gameState.current_game.phase === "EXTRA_CARDS" && beautify_gameState.player.isTrump)
            center = <ExtraCardPanel playCard={this.playCard.bind(this)}
                                     submitExtraCards = {this.submitExtraCards.bind(this)}
                                     hasJoker={beautify_gameState.has_joker}
                                     extra_cards={split_string(this.state.extra_cards.join(''))}/>;



        // console.log(this.props.gameState);
        return <div id={"game-room"}>
            <ScorePanel room={this.props.room.id}
                        trumpsuit={this.props.gameState.current_game.trump_suit}
                        maxbet={Math.max(...this.props.gameState.current_game.bids)}
                        currentScore={this.props.gameState.current_game.scores}
                        overallScore={this.props.gameState.scores}
                        playerTeam={(this.props.gameState.players[this.props.playerId].position_at_table)%2}
            />
            {this.props.gameState.current_game.phase==="END"?<WinPanel
                scores={this.props.gameState.score_history} total={this.props.gameState.scores} players={this.props.gameState.players}/>:null}
            <div id={"teammate"}> <Player stats={beautify_gameState.teammate}/></div>
            <div id={"center"}>
                <Player stats={beautify_gameState.left}/>
                {center}
                <Player stats={beautify_gameState.right}/>
            </div>
            <div id={"my-hand"}>
                <Hand cards={decrypt(this.props.gameState.players[this.props.playerId].encrypted_hand, this.props.passKey)}
                      extra_cards={this.state.extra_cards}
                      playCard={this.playCard.bind(this)}
                      isTurn={beautify_gameState.player.isTurn}
                      phase={this.props.gameState.current_game.phase}
                      firstSuit = {this.props.gameState.current_game.played_cards}
                      trump_suit = {this.props.gameState.current_game.trump_suit}
                />
            </div>
            {/*<pre>*/}
            {/*{JSON.stringify(this.props.gameState, null, "\t")}*/}
            {/*</pre>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);