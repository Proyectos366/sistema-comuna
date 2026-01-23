// features/users/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchParticipantes } from "@/store/features/participantes/thunks/todosParticipantes";
import { fetchParticipantesIdFormacion } from "./thunks/participantesIdFormacion";
import { validarModulo } from "./thunks/validarModulo";
import { verificarParticipanteCurso } from "./thunks/verificarParticipanteCurso";
import { certificarParticipanteCurso } from "./thunks/certificarParticipanteCurso";

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
      })
      .addCase(verificarParticipanteCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verificarParticipanteCurso.fulfilled, (state, action) => {
        state.loading = false;
        const particiCursoForma = action.payload;

        const index = state.participantes.findIndex(
          (u) => u.id === particiCursoForma.id,
        );
        if (index !== -1) {
          state.participantes[index] = particiCursoForma;
        }
      })
      .addCase(verificarParticipanteCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(certificarParticipanteCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(certificarParticipanteCurso.fulfilled, (state, action) => {
        state.loading = false;
        const particiCursoForma = action.payload;

        const index = state.participantes.findIndex(
          (u) => u.id === particiCursoForma.id,
        );
        if (index !== -1) {
          state.participantes[index] = particiCursoForma;
        }
      })
      .addCase(certificarParticipanteCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default participantesSlice.reducer;
