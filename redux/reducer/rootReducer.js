import { combineReducers } from "redux";
import reducer from "./reducer";

const rootReducer = combineReducers({
  main: reducer,
});

export default rootReducer;
