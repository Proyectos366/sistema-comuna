// features/consejos/consejosSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchConsejosIdParroquia } from "@/store/features/consejos/thunks/consejosIdParroquia";
import { fetchConsejosIdComuna } from "@/store/features/consejos/thunks/consejosIdComuna";
import { fetchConsejosIdCircuito } from "@/store/features/consejos/thunks/consejosIdCircuito";
import { crearConsejo } from "@/store/features/consejos/thunks/crearConsejo";
import { actualizarConsejo } from "@/store/features/consejos/thunks/actualizarConsejo";
import { eliminarRestaurarConsejo } from "@/store/features/consejos/thunks/eliminarRestaurarConsejo";
import { fetchTodosConsejos } from "@/store/features/consejos/thunks/todosConsejos";

const consejosSlice = createSlice({
  name: "consejos",
  initialState: {
    consejos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosConsejos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosConsejos.fulfilled, (state, action) => {
        state.loading = false;
        state.consejos = action.payload;
      })
      .addCase(fetchTodosConsejos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConsejosIdParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsejosIdParroquia.fulfilled, (state, action) => {
        state.loading = false;
        state.consejos = action.payload;
      })
      .addCase(fetchConsejosIdParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConsejosIdComuna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsejosIdComuna.fulfilled, (state, action) => {
        state.loading = false;
        state.consejos = action.payload;
      })
      .addCase(fetchConsejosIdComuna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConsejosIdCircuito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsejosIdCircuito.fulfilled, (state, action) => {
        state.loading = false;
        state.consejos = action.payload;
      })
      .addCase(fetchConsejosIdCircuito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearConsejo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearConsejo.fulfilled, (state, action) => {
        state.loading = false;
        state.consejos.push(action.payload);
      })
      .addCase(crearConsejo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarConsejo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarConsejo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.consejos.findIndex(
          (consejo) => consejo.id === action.payload.id
        );
        if (index !== -1) {
          state.consejos[index] = action.payload;
        }
      })
      .addCase(actualizarConsejo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarConsejo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarConsejo.fulfilled, (state, action) => {
        state.loading = false;
        const consejoActualizado = action.payload;

        const index = state.consejos.findIndex(
          (u) => u.id === consejoActualizado.id
        );
        if (index !== -1) {
          state.consejos[index] = consejoActualizado;
        }
      })
      .addCase(eliminarRestaurarConsejo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default consejosSlice.reducer;
