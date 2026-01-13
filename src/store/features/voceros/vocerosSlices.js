// features/Voceros/vocerosSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchVocerosMunicipio } from "@/store/features/voceros/thunks/todosVocerosMunicipio";
import { fetchVocerosIdParroquia } from "@/store/features/voceros/thunks/vocerosIdParroquia";
import { fetchVocerosIdComuna } from "@/store/features/voceros/thunks/vocerosIdComuna";
import { fetchVocerosIdCircuito } from "@/store/features/voceros/thunks/vocerosIdCircuito";
import { fetchVocerosIdConsejo } from "@/store/features/voceros/thunks/vocerosIdConsejo";
import { fetchVoceroCedula } from "@/store/features/voceros/thunks/voceroCedula";

import { crearVocero } from "@/store/features/voceros/thunks/crearVocero";
import { actualizarVocero } from "@/store/features/voceros/thunks/actualizarVocero";
import { eliminarRestaurarVocero } from "@/store/features/voceros/thunks/eliminarRestaurarVocero";
import { fetchTodosVoceros } from "@/store/features/voceros/thunks/todosVoceros";

const vocerosSlice = createSlice({
  name: "voceros",
  initialState: {
    voceros: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetVoceros: (state) => {
      state.loading = false;
      state.voceros = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosVoceros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosVoceros.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchTodosVoceros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVocerosMunicipio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocerosMunicipio.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVocerosMunicipio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVocerosIdParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocerosIdParroquia.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVocerosIdParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVocerosIdComuna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocerosIdComuna.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVocerosIdComuna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVocerosIdCircuito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocerosIdCircuito.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVocerosIdCircuito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVocerosIdConsejo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocerosIdConsejo.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVocerosIdConsejo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearVocero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearVocero.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros.push(action.payload);
      })
      .addCase(crearVocero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarVocero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarVocero.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.voceros.findIndex(
          (vocero) => vocero.id === action.payload.id
        );
        if (index !== -1) {
          state.voceros[index] = action.payload;
        }
      })
      .addCase(actualizarVocero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarVocero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarVocero.fulfilled, (state, action) => {
        state.loading = false;
        const voceroActualizado = action.payload;

        const index = state.voceros.findIndex(
          (u) => u.id === voceroActualizado.id
        );
        if (index !== -1) {
          state.voceros[index] = voceroActualizado;
        }
      })
      .addCase(eliminarRestaurarVocero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVoceroCedula.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoceroCedula.fulfilled, (state, action) => {
        state.loading = false;
        state.voceros = action.payload;
      })
      .addCase(fetchVoceroCedula.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetVoceros } = vocerosSlice.actions;
export default vocerosSlice.reducer;
