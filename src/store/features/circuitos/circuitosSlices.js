// features/circuitos/circuitosSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";
import { crearCircuito } from "@/store/features/circuitos/thunks/crearCircuito";
import { actualizarCircuito } from "@/store/features/circuitos/thunks/actualizarCircuito";
import { eliminarRestaurarCircuito } from "@/store/features/circuitos/thunks/eliminarRestaurarCircuito";
import { fetchTodosCircuitos } from "@/store/features/circuitos/thunks/todosCircuitos";

const circuitosSlice = createSlice({
  name: "circuitos",
  initialState: {
    circuitos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosCircuitos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosCircuitos.fulfilled, (state, action) => {
        state.loading = false;
        state.circuitos = action.payload;
      })
      .addCase(fetchTodosCircuitos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCircuitosIdParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCircuitosIdParroquia.fulfilled, (state, action) => {
        state.loading = false;
        state.circuitos = action.payload;
      })
      .addCase(fetchCircuitosIdParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearCircuito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCircuito.fulfilled, (state, action) => {
        state.loading = false;
        state.circuitos.push(action.payload);
      })
      .addCase(crearCircuito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarCircuito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCircuito.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.circuitos.findIndex(
          (circuito) => circuito.id === action.payload.id
        );
        if (index !== -1) {
          state.circuitos[index] = action.payload;
        }
      })
      .addCase(actualizarCircuito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarCircuito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarCircuito.fulfilled, (state, action) => {
        state.loading = false;
        const circuitoActualizado = action.payload;

        const index = state.circuitos.findIndex(
          (u) => u.id === circuitoActualizado.id
        );
        if (index !== -1) {
          state.circuitos[index] = circuitoActualizado;
        }
      })
      .addCase(eliminarRestaurarCircuito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default circuitosSlice.reducer;
