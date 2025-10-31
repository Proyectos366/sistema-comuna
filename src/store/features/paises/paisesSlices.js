// features/users/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchPaises } from "./thunks/todosPaises";
import { crearPais } from "./thunks/crearPais";

// import { cambiarAccesoUsuario } from "./thunks/cambiarAccesoUsuario";
import { eliminarRestaurarPais } from "./thunks/eliminarRestaurarPais";
// import { cambiarDepartamentoUsuario } from "./thunks/cambiarDepartamentoUsuario";
// import { cambiarRolUsuario } from "./thunks/cambiarRolUsuario";

const paisesSlice = createSlice({
  name: "paises",
  initialState: {
    paises: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaises.fulfilled, (state, action) => {
        state.loading = false;
        state.paises = action.payload;
      })
      .addCase(fetchPaises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearPais.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearPais.fulfilled, (state, action) => {
        state.loading = false;
        state.paises.push(action.payload);
      })
      .addCase(crearPais.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarPais.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarPais.fulfilled, (state, action) => {
        state.loading = false;
        const paisActualizado = action.payload;

        const index = state.paises.findIndex(
          (u) => u.id === paisActualizado.id
        );
        if (index !== -1) {
          state.paises[index] = paisActualizado;
        }
      })
      .addCase(eliminarRestaurarPais.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paisesSlice.reducer;
