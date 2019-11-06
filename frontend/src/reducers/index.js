import { combineReducers } from 'redux'
import {activeRouteReducer} from "./active_route"

export const rootReducer  =
    combineReducers({
        active_route:activeRouteReducer,
    });
