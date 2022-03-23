import * as Colyseus from "colyseus.js";

export const ON_SUCCESS_CREAT_CLIENT = "ON_SUCCESS_CREAT_CLIENT";
export const ON_SUCCESS_CREAT_ROOM = "ON_SUCCESS_CREAT_ROOM";
export const ON_FAIL_CREAT_ROOM = "ON_FAIL_CREAT_CLIENT";
export const ON_SUCCESS_JOIN_ROOM = "ON_SUCCESS_JOIN_ROOM";
export const ON_FAIL_JOIN_ROOM = "ON_FAIL_JOIN_ROOM";
export const STATE_CHANGED = "STATE_CHANGED";
export const KEY_RECIEVED = "KEY_RECIEVED";
export const RECONNECTED = "RECONNECTED";
export const ROOMEXISTS = "ROOMEXISTS"

let server_address = "http://chess.mohammad-reza.com/"
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    server_address = "http://localhost:2567"
}

export const create_client = server => {
    let client;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        client = new Colyseus.Client('ws://localhost:2567');
    } else {
        client = new Colyseus.Client('ws://chess.mohammad-reza.com');
    }

    return (dispatch, getState) => {
        dispatch(onSuccessCreatClient(client));
    };
};

const onSuccessCreatClient = data => {
    return {
        type: ON_SUCCESS_CREAT_CLIENT,
        data
    };
};

export const create_room = (client, room, name = "untitled", hasJoker, maxScore) => {
    if(room !== undefined)
        return dispatch => {dispatch(onFailCreatRoom("already in a room"));};
    return dispatch => {
        if (client === undefined){
            dispatch(onFailCreatRoom("No connection has been stabilised"));
        }
        else {
            client.create("shelem_room", {player:{name:name}, has_joker:hasJoker, maxScore:maxScore}).then(room => {
                console.log("joined successfully");
                room.onStateChange((state) => (dispatch(stateChanged(state))));
                dispatch(onSuccessCreatRoom(room));
                room.onMessage("privateKey",  (message) => {
                    dispatch(onKeyRecieved(message["key"]))
                  });
            }).catch(e => {
                console.error("join error", e);
                dispatch(onFailCreatRoom(e));
            });
        }
    }

};

const onSuccessCreatRoom = data => {
    return {
        type: ON_SUCCESS_CREAT_ROOM,
        data
    };
};

const onFailCreatRoom = data => {
    return {
        type: ON_FAIL_CREAT_ROOM,
        data
    };
};

export const join_room = (client, room_name, room, name="untitled2") => {
    if(room !== undefined)
        return dispatch => {dispatch(onFailCreatRoom("already in a room"));}
    return (dispatch) => {
        if(client === undefined){
            dispatch(onFailJoinRoom("no connection has been stabilised"))
        }
        else {
            client.joinById(room_name, {player:{"name":name}}).then(room => {
                room.onStateChange((state) => (dispatch(stateChanged(state))));
                room.onMessage("privateKey",  (message) => {
                    dispatch(onKeyRecieved(message["key"]))//this is called when privateKey message is passed to client
                  });
                dispatch(onSuccessJoinRoom(room));
            }).catch(e => {
                dispatch(onFailJoinRoom(e));
            });
        }
    };
};

const onSuccessJoinRoom = data => {
    return {
        type: ON_SUCCESS_JOIN_ROOM,
        data
    };
};

const onFailJoinRoom = data => {
    return {
        type: ON_FAIL_JOIN_ROOM,
        data
    };
};

const stateChanged = data => {
    return {
        type: STATE_CHANGED,
        data
    };
};

const onKeyRecieved = data => {
    return {
        type: KEY_RECIEVED,
        data
    };
};

export const reconnect = (client, roomId, sessionId) => {
    // console.log("clicked!!")
    return (dispatch) => {
        if(client === undefined){
            dispatch(onFailJoinRoom("no connection has been stabilised"))
            localStorage.removeItem('room')
        }
        else {
            client.reconnect(roomId, sessionId).then(room => {
                room.onStateChange((state) => (dispatch(stateChanged(state))));
                room.onMessage("privateKey",  (message) => {
                    dispatch(onReconnect({
                        privateKey:message["key"],
                        room:room
                    }))
                    // dispatch(onKeyRecieved(message["key"]))//this is called when privateKey message is passed to client
                    // dispatch(onSuccessJoinRoom(room));
                });
                room.send('privateKey',{})
            }).catch(e => {
                localStorage.removeItem('room')
                dispatch(onFailJoinRoom(e));
            });
        }
    };
};

const onReconnect = data => {
    return {
        type: RECONNECTED,
        data
    };
};

const onRoomExists = () => {
    return{
        type: ROOMEXISTS,
    }
}

export const is_room_available = (roomId) => {
    console.log(server_address + "/getrooms")
    return (dispatch) => {
        fetch(server_address + "/getrooms").then(response  => response .json()).then(data => {
            for (let i = 0; i < data.length; i++)
                if (data[i].roomId === roomId)
                {
                    dispatch(onRoomExists())
                    break
                }
        }).catch(e => console.log(e))}
}