// features/estantes/estantesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchEstantes } from "@/store/features/estantes/thunks/todosEstantes";
import { crearEstante } from "@/store/features/estantes/thunks/crearEstante";
import { actualizarEstante } from "@/store/features/estantes/thunks/actualizarEstante";
import { eliminarRestaurarEstante } from "@/store/features/estantes/thunks/eliminarRestaurarEstante";
import { fetchEstantesInstitucion } from "@/store/features/estantes/thunks/todosEstantesInstitucion";
import { fetchEstantesIdDepartamento } from "@/store/features/estantes/thunks/estantesIdDepartamento";
import { fetchEstantesDepartamentoMiembro } from "./thunks/todosEstantesDepartamentoMiembro";

const estantesSlice = createSlice({
  name: "estantes",
  initialState: {
    estantes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstantes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstantes.fulfilled, (state, action) => {
        state.loading = false;
        state.estantes = action.payload;
      })
      .addCase(fetchEstantes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEstantesInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstantesInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.estantes = action.payload;
      })
      .addCase(fetchEstantesInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEstantesIdDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstantesIdDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        state.estantes = action.payload;
      })
      .addCase(fetchEstantesIdDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEstantesDepartamentoMiembro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstantesDepartamentoMiembro.fulfilled, (state, action) => {
        state.loading = false;
        state.estantes = action.payload;
      })
      .addCase(fetchEstantesDepartamentoMiembro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearEstante.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearEstante.fulfilled, (state, action) => {
        state.loading = false;
        state.estantes.push(action.payload);
      })
      .addCase(crearEstante.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarEstante.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarEstante.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.estantes.findIndex(
          (estante) => estante.id === action.payload.id,
        );
        if (index !== -1) {
          state.estantes[index] = action.payload;
        }
      })
      .addCase(actualizarEstante.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarEstante.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarEstante.fulfilled, (state, action) => {
        state.loading = false;
        const estanteActualizado = action.payload;

        const index = state.estantes.findIndex(
          (u) => u.id === estanteActualizado.id,
        );
        if (index !== -1) {
          state.estantes[index] = estanteActualizado;
        }
      })
      .addCase(eliminarRestaurarEstante.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default estantesSlice.reducer;
