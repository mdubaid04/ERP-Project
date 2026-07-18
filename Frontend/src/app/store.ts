import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch thunk ko allow krne ke liye use hota hai dispatch me kiuki normally disptach kewal plain action hi accept krta hai

// store.get() method store ka sara data return krta hai return type uska type btata hai or rootstate me store krdeta
