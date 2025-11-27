// features/departamentos/departamentosSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDepartamentos } from "@/store/features/departamentos/thunks/todosDepartamentos";
import { fetchDepartamentosIdInstitucion } from "@/store/features/departamentos/thunks/departamentosIdInstitucion";
import { crearDepartamento } from "@/store/features/departamentos/thunks/crearDepartamento";
import { actualizarDepartamento } from "@/store/features/departamentos/thunks/actualizarDepartamento";
import { eliminarRestaurarDepartamento } from "@/store/features/departamentos/thunks/eliminarRestaurarDepartamento";

const departamentosSlice = createSlice({
  name: "departamentos",
  initialState: {
    departamentos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartamentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartamentos.fulfilled, (state, action) => {
        state.loading = false;
        state.departamentos = action.payload;
      })
      .addCase(fetchDepartamentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        state.departamentos.push(action.payload);
      })
      .addCase(crearDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchDepartamentosIdInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartamentosIdInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.departamentos = action.payload;
      })
      .addCase(fetchDepartamentosIdInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(actualizarDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departamentos.findIndex(
          (inst) => inst.id === action.payload.id
        );
        if (index !== -1) {
          state.departamentos[index] = action.payload;
        }
      })
      .addCase(actualizarDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarDepartamento.fulfilled, (state, action) => {
        state.loading = false;
        const departamentoActualizado = action.payload;

        const index = state.departamentos.findIndex(
          (u) => u.id === departamentoActualizado.id
        );
        if (index !== -1) {
          state.departamentos[index] = departamentoActualizado;
        }
      })
      .addCase(eliminarRestaurarDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departamentosSlice.reducer;
