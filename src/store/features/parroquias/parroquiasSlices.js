// features/users/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchParroquiasIdMunicipio } from "./thunks/parroquiasIdMunicipio";
import { crearParroquia } from "./thunks/crearParroquia";
import { eliminarRestaurarParroquia } from "./thunks/eliminarRestaurarParroquia";

const parroquiasSlice = createSlice({
  name: "parroquias",
  initialState: {
    parroquias: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParroquiasIdMunicipio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.parroquias = [];
      })
      .addCase(fetchParroquiasIdMunicipio.fulfilled, (state, action) => {
        state.loading = false;
        state.parroquias = action.payload;
      })
      .addCase(fetchParroquiasIdMunicipio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.parroquias = [];
      })
      .addCase(crearParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearParroquia.fulfilled, (state, action) => {
        state.loading = false;
        state.parroquias.push(action.payload);
      })
      .addCase(crearParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarParroquia.fulfilled, (state, action) => {
        state.loading = false;
        const parroquiaActualizada = action.payload;

        const index = state.parroquias.findIndex(
          (u) => u.id === parroquiaActualizada.id
        );
        if (index !== -1) {
          state.parroquias[index] = parroquiaActualizada;
        }
      })
      .addCase(eliminarRestaurarParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default parroquiasSlice.reducer;
