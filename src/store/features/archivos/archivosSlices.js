// features/archivos/archivosSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchArchivos } from "@/store/features/archivos/thunks/todosArchivos";
import { crearArchivo } from "@/store/features/archivos/thunks/crearArchivo";
import { actualizarArchivo } from "@/store/features/archivos/thunks/actualizarArchivo";
import { eliminarRestaurarArchivo } from "@/store/features/archivos/thunks/eliminarRestaurarArchivo";
import { fetchArchivosIdInstitucion } from "@/store/features/archivos/thunks/archivosIdInstitucion";
import { fetchArchivosIdDepartamento } from "@/store/features/archivos/thunks/archivosIdDepartamento";
import { fetchArchivosIdEstante } from "@/store/features/archivos/thunks/archivosIdEstante";
import { fetchArchivosIdCarpeta } from "@/store/features/archivos/thunks/archivosIdCarpeta";

const archivosSlice = createSlice({
  name: "archivos",
  initialState: {
    archivos: [],
    loading: false,
    error: null,
    archivoActual: {
      idArchivo: null,
      nombre: null,
      nombre_original: null,
      nombre_sistema: null,
      codigo: null,
    },
  },
  reducers: {
    setArchivoActual: (state, action) => {
      state.archivoActual = {
        idArchivo: action.payload.id,
        nombre: action.payload.nombre,
        nombre_original: action.payload.nombre_original,
        nombre_sistema: action.payload.nombre_sistema,
        codigo: action.payload.codigo,
      };
    },
    clearArchivoActual: (state) => {
      state.archivoActual = {
        idArchivo: null,
        nombre: null,
        nombre_original: null,
        nombre_sistema: null,
        codigo: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchivos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivos.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchArchivosIdInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivosIdInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivosIdInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchArchivosIdDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivosIdDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivosIdDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchArchivosIdEstante.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivosIdEstante.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivosIdEstante.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchArchivosIdCarpeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivosIdCarpeta.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivosIdCarpeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearArchivo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearArchivo.fulfilled, (state, action) => {
        state.loading = false;
        state.archivos.push(action.payload);
      })
      .addCase(crearArchivo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarArchivo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarArchivo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.archivos.findIndex(
          (archivo) => archivo.id === action.payload.id,
        );
        if (index !== -1) {
          state.archivos[index] = action.payload;
        }
      })
      .addCase(actualizarArchivo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarArchivo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarArchivo.fulfilled, (state, action) => {
        state.loading = false;
        const archivoActualizado = action.payload;

        const index = state.archivos.findIndex(
          (u) => u.id === archivoActualizado.id,
        );
        if (index !== -1) {
          state.archivos[index] = archivoActualizado;
        }
      })
      .addCase(eliminarRestaurarArchivo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setArchivoActual, clearArchivoActual } = archivosSlice.actions;
export default archivosSlice.reducer;
