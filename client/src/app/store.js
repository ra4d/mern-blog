import {configureStore , combineReducers} from "@reduxjs/toolkit"
import {persistReducer , persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage";

import userSlice from "../features/user/userSlice";
import themeSlice from "../features/them/themeSlice";

const rootReducer = combineReducers({
    user:userSlice.reducer,
    theme:themeSlice.reducer,
})
const presistConfig = {
    key:"root",
    storage,
    version:1
}
const persistedReducer = persistReducer(presistConfig , rootReducer);
const store = configureStore({
    reducer:persistedReducer,
    middleware : (getDefaultMiddelware)=> getDefaultMiddelware(
        {serializableCheck : false}
    )
})
export const presistor = persistStore(store)

export default store;