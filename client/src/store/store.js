import { create } from "zustand";

export let login = create((set) => ({
  data: {
    username: "",
    password: "",
  },
  setUsername: (username) =>
    set((state) => ({ data: { ...state.data, username: username } })),
  setPassword: (password) =>
    set((state) => ({ data: { ...state.data, password: password } })),
}));
