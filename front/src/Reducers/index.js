import { combineReducers } from "redux";
import AppReducer from "./AppReducer"
// import GameReducer from "./GameReducer"

const reducer = combineReducers({
    AppReducer,
});

export default reducer;