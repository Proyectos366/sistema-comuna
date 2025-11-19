// features/users/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchEstadosIdPais } from "./thunks/estadosIdPais";
import { crearEstado } from "./thunks/crearEstado";

// import { cambiarAccesoUsuario } from "./thunks/cambiarAccesoUsuario";
import { eliminarRestaurarEstado } from "./thunks/eliminarRestaurarEstado";
// import { cambiarDepartamentoUsuario } from "./thunks/cambiarDepartamentoUsuario";
// import { cambiarRolUsuario } from "./thunks/cambiarRolUsuario";

const estadosSlice = createSlice({
  name: "estados",
  initialState: {
    estados: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstadosIdPais.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.estados = [];
      })
      .addCase(fetchEstadosIdPais.fulfilled, (state, action) => {
        state.loading = false;
        state.estados = action.payload;
      })
      .addCase(fetchEstadosIdPais.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.estados = [];
      })
      .addCase(crearEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearEstado.fulfilled, (state, action) => {
        state.loading = false;
        state.estados.push(action.payload);
      })
      .addCase(crearEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarEstado.fulfilled, (state, action) => {
        state.loading = false;
        const estadoActualizado = action.payload;

        const index = state.estados.findIndex(
          (u) => u.id === estadoActualizado.id
        );
        if (index !== -1) {
          state.estados[index] = estadoActualizado;
        }
      })
      .addCase(eliminarRestaurarEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default estadosSlice.reducer;
