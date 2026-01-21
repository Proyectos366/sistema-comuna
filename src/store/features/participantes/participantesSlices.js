// features/users/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchParticipantes } from "@/store/features/participantes/thunks/todosParticipantes";
import { fetchParticipantesIdFormacion } from "./thunks/participantesIdFormacion";
import { validarModulo } from "./thunks/validarModulo";

const participantesSlice = createSlice({
  name: "participantes",
  initialState: {
    participantes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipantes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantes.fulfilled, (state, action) => {
        state.loading = false;
        state.participantes = action.payload;
      })
      .addCase(fetchParticipantes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchParticipantesIdFormacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantesIdFormacion.fulfilled, (state, action) => {
        state.loading = false;
        state.participantes = action.payload;
      })
      .addCase(fetchParticipantesIdFormacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(validarModulo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validarModulo.fulfilled, (state, action) => {
        state.loading = false;
        const asistenciaActualizada = action.payload;

        const index = state.participantes.findIndex(
          (u) => u.id === asistenciaActualizada.id,
        );
        if (index !== -1) {
          state.participantes[index] = asistenciaActualizada;
        }
      })
      .addCase(validarModulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default participantesSlice.reducer;
