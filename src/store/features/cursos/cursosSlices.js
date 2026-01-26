// features/cursos/cursosSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchCursos } from "@/store/features/cursos/thunks/todosCursos";
import { fetchCursosIdFormacion } from "./thunks/cursosIdFormacion";

const cursosSlice = createSlice({
  name: "cursos",
  initialState: {
    cursos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursos.fulfilled, (state, action) => {
        state.loading = false;
        state.cursos = action.payload;
      })
      .addCase(fetchCursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCursosIdFormacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursosIdFormacion.fulfilled, (state, action) => {
        state.loading = false;
        state.cursos = action.payload;
      })
      .addCase(fetchCursosIdFormacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cursosSlice.reducer;
