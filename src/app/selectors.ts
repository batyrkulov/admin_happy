import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";

export const main = {
  uid: createSelector(
    (state: RootState) => state.main.uid,
    (value) => value,
  ),
}
