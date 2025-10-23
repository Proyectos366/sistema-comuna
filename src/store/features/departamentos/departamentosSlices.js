// features/departamentos/departamentosSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDepartamentos } from "@/store/features/departamentos/thunks/todosDepartamentos";
import { crearDepartamento } from "@/store/features/departamentos/thunks/crearDepartamento";

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
      // fetchDepartamentos
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
      // crearDepartamento
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
      });
  },
});

export default departamentosSlice.reducer;
