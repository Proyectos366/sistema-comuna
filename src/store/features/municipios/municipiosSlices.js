// features/users/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchMunicipiosIdEstado } from "./thunks/municipiosIdEstado";
import { crearMunicipio } from "./thunks/crearMunicipio";
import { eliminarRestaurarMunicipio } from "./thunks/eliminarRestaurarMunicipio";

const municipiosSlice = createSlice({
  name: "municipios",
  initialState: {
    municipios: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMunicipiosIdEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.municipios = [];
      })
      .addCase(fetchMunicipiosIdEstado.fulfilled, (state, action) => {
        state.loading = false;
        state.municipios = action.payload;
      })
      .addCase(fetchMunicipiosIdEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.municipios = [];
      })
      .addCase(crearMunicipio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearMunicipio.fulfilled, (state, action) => {
        state.loading = false;
        state.municipios.push(action.payload);
      })
      .addCase(crearMunicipio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarMunicipio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarMunicipio.fulfilled, (state, action) => {
        state.loading = false;
        const municipioActualizado = action.payload;

        const index = state.municipios.findIndex(
          (u) => u.id === municipioActualizado.id
        );
        if (index !== -1) {
          state.municipios[index] = municipioActualizado;
        }
      })
      .addCase(eliminarRestaurarMunicipio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default municipiosSlice.reducer;
