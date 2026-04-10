// features/carpetas/carpetasSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchCarpetas } from "@/store/features/carpetas/thunks/todasCarpetas";
import { crearCarpeta } from "@/store/features/carpetas/thunks/crearCarpeta";
import { actualizarCarpeta } from "@/store/features/carpetas/thunks/actualizarCarpeta";
import { eliminarRestaurarCarpeta } from "@/store/features/carpetas/thunks/eliminarRestaurarCarpeta";
import { fetchCarpetasInstitucion } from "@/store/features/carpetas/thunks/todasCarpetasInstitucion";
import { fetchCarpetasIdEstante } from "@/store/features/carpetas/thunks/carpetasIdEstante";
import { fetchCarpetasDepartamentoMiembro } from "@/store/features/carpetas/thunks/todasCarpetasDepartamentoMiembro";
import { fetchCarpetasIdDepartamento } from "@/store/features/carpetas/thunks/carpetasIdDepartamento";

const carpetasSlice = createSlice({
  name: "carpetas",
  initialState: {
    carpetas: [],
    loading: false,
    error: null,
    carpetaActual: {
      idCarpeta: null,
      nombre: null,
      nivel: null,
      seccion: null,
    },
  },
  reducers: {
    setCarpetaActual: (state, action) => {
      state.carpetaActual = {
        idCarpeta: action.payload.id,
        nombre: action.payload.nombre,
        nivel: action.payload.nivel,
        seccion: action.payload.seccion,
      };
    },
    clearCarpetaActual: (state) => {
      state.carpetaActual = {
        idCarpeta: null,
        nombre: null,
        nivel: null,
        seccion: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarpetas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetas.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas = action.payload;
      })
      .addCase(fetchCarpetas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCarpetasInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetasInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas = action.payload;
      })
      .addCase(fetchCarpetasInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCarpetasIdEstante.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetasIdEstante.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas = action.payload;
      })
      .addCase(fetchCarpetasIdEstante.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCarpetasIdDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetasIdDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas = action.payload;
      })
      .addCase(fetchCarpetasIdDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCarpetasDepartamentoMiembro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetasDepartamentoMiembro.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas = action.payload;
      })
      .addCase(fetchCarpetasDepartamentoMiembro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearCarpeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCarpeta.fulfilled, (state, action) => {
        state.loading = false;
        state.carpetas.push(action.payload);
      })
      .addCase(crearCarpeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarCarpeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCarpeta.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.carpetas.findIndex(
          (estante) => estante.id === action.payload.id,
        );
        if (index !== -1) {
          state.carpetas[index] = action.payload;
        }
      })
      .addCase(actualizarCarpeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarCarpeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarCarpeta.fulfilled, (state, action) => {
        state.loading = false;
        const CarpetaActualizado = action.payload;

        const index = state.carpetas.findIndex(
          (u) => u.id === CarpetaActualizado.id,
        );
        if (index !== -1) {
          state.carpetas[index] = CarpetaActualizado;
        }
      })
      .addCase(eliminarRestaurarCarpeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCarpetaActual, clearCarpetaActual } = carpetasSlice.actions;
export default carpetasSlice.reducer;
