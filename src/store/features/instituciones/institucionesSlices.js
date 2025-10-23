// features/instituciones/institucionesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchInstituciones } from "@/store/features/instituciones/thunks/todasInstituciones";
import { crearInstitucion } from "@/store/features/instituciones/thunks/crearInstitucion";

const institucionesSlice = createSlice({
  name: "instituciones",
  initialState: {
    instituciones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchinstituciones
      .addCase(fetchInstituciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstituciones.fulfilled, (state, action) => {
        state.loading = false;
        state.instituciones = action.payload;
      })
      .addCase(fetchInstituciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // crearInstitucion
      .addCase(crearInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.instituciones.push(action.payload);
      })
      .addCase(crearInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default institucionesSlice.reducer;
