// features/users/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsuarios } from "./thunks/todosUsuarios";
import { crearUsuario } from "./thunks/crearUsuario";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsuarios
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // crearUsuario
      .addCase(crearUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(crearUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default usersSlice.reducer;
