import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupState {
  popups: Array<string>;
}

const rmPopup = (state: PopupState, index: number) => {
  delete state.popups[index];
};

const newPopup = (state: PopupState, text: string) => {
  state.popups.push(text);
};

const initialState: PopupState = {
  popups: [],
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    addPopup: (state, action: PayloadAction<string>) => {
      newPopup(state, action.payload);
    },
    unauthorized: (state) => {
      newPopup(state, "You have to login to use this");
    },
    removePopup: (state, action: PayloadAction<number>) => {
      rmPopup(state, action.payload);
    },
  },
});

export const { addPopup, removePopup, unauthorized } = popupSlice.actions;

export default popupSlice.reducer;
