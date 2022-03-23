import * as actions from "../Actions/GameActions";

const initState = {
    client: undefined,
    room: undefined,
    gameState: {},
    lastChanged: undefined,
    screen: "MainMenu",
    playerId: undefined,
    passKey:undefined,
    reconnectRoom: false
};

export default function AppReducer(state = initState, action) {
    if (state === undefined) return initState;
    switch (action.type) {
        case actions.ON_SUCCESS_CREAT_CLIENT:
            return {
                ...state,
                client: action.data
            };
        case actions.ON_SUCCESS_JOIN_ROOM:
            localStorage.setItem('room', JSON.stringify(action.data));
            localStorage.setItem('client', JSON.stringify(action.data));
            return {
                ...state,
                screen: "TeamSelection",
                room: action.data,
                playerId: action.data.sessionId
            };
        case actions.ON_SUCCESS_CREAT_ROOM:
            localStorage.setItem('room', JSON.stringify(action.data));
            localStorage.setItem('client', JSON.stringify(action.data));
            return {
                ...state,
                screen: "TeamSelection",
                room: action.data,
                playerId: action.data.sessionId
            }
        case actions.ON_FAIL_CREAT_ROOM:
            return {
                ...state,
                error: action.data
            };
        case actions.ON_FAIL_JOIN_ROOM:
            return {
                ...state,
                error: action.data
            };
        case actions.STATE_CHANGED:
            // localStorage.setItem('lastChanged', new Date().getTime().toString());
            return {
                ...state,
                gameState: action.data,
                lastChanged: new Date().getTime()
            };
        case actions.KEY_RECIEVED:
            return {
                ...state,
                passKey: action.data,
            }
        case actions.RECONNECTED:{
            let client = JSON.parse(localStorage.getItem('client'));
            return {
                ...state,
                passKey: action.data.privateKey,
                room: action.data.room,
                client: client,
                playerId: client.sessionId
            }

        }
        case actions.ROOMEXISTS: {
            return {
                ...state,
                reconnectRoom: true
            }
        }
        default:
            return state;
    }
}