import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IUser from "../../interfaces/User";
import { promiseCopyPaste } from "../../utils";

interface Userauth {
  user?: IUser;
}

const initialState: Userauth = {
  user: undefined,
};

export const userauthSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = undefined;
      localStorage.removeItem("auth-token");
    },
  },
});

export const { setUser, logout } = userauthSlice.actions;

export const getUserDataAsync = () => (dispatch: any) => {
  const token = localStorage.getItem("auth-token");
  if (!token) return;
  promiseCopyPaste(
    fetch(process.env.REACT_APP_BASE_URL + "/api/v1/blog/user_profile", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }),
    (result: {
      id: number;
      slug: string;
      avatar?: string;
      username: string;
      first_name: string;
      last_name: string;
    }) => {
      dispatch(
        setUser({
          id: result.id,
          slug: result.slug,
          avatar: result.avatar,
          firstName: result.first_name,
          lastName: result.last_name,
          username: result.username,
        })
      );
    }
  );
};

export default userauthSlice.reducer;
