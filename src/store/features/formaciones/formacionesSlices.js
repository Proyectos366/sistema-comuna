// features/formaciones/formacionesSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchFormaciones } from "@/store/features/formaciones/thunks/todasFormaciones";
import { fetchFormacionesInstitucion } from "@/store/features/formaciones/thunks/formacionesInstitucion";
import { crearFormacion } from "@/store/features/formaciones/thunks/crearFormacion";
import { actualizarFormacion } from "@/store/features/formaciones/thunks/actualizarFormacion";
import { eliminarRestaurarFormacion } from "@/store/features/formaciones/thunks/eliminarRestaurarFormacion";

const formacionesSlice = createSlice({
  name: "formaciones",
  initialState: {
    formaciones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.formaciones = action.payload;
      })
      .addCase(fetchFormaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFormacionesInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormacionesInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.formaciones = action.payload;
      })
      .addCase(fetchFormacionesInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearFormacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearFormacion.fulfilled, (state, action) => {
        state.loading = false;
        state.formaciones.push(action.payload);
      })
      .addCase(crearFormacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarFormacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarFormacion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.formaciones.findIndex(
          (formacion) => formacion.id === action.payload.id
        );
        if (index !== -1) {
          state.formaciones[index] = action.payload;
        }
      })
      .addCase(actualizarFormacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarFormacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarFormacion.fulfilled, (state, action) => {
        state.loading = false;
        const formacionActualizada = action.payload;

        const index = state.formaciones.findIndex(
          (u) => u.id === formacionActualizada.id
        );
        if (index !== -1) {
          state.formaciones[index] = formacionActualizada;
        }
      })
      .addCase(eliminarRestaurarFormacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default formacionesSlice.reducer;
