// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { consultarUsuarioActivo } from "@/store/features/auth/thunks/consultarUsuarioActivo";
import { cerrarSesion } from "@/store/features/auth/thunks/cerrarSesion";

const initialState = {
  usuarioActivo: null,
  departamento: null,
  validado: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.usuarioActivo = null;
      state.departamento = null;
      state.validado = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(consultarUsuarioActivo.fulfilled, (state, action) => {
        state.usuarioActivo = action.payload.usuario;
        state.departamento = action.payload.departamento;
        state.validado = action.payload.validado;
        state.loading = false;
        state.error = null;
      })
      .addCase(consultarUsuarioActivo.rejected, (state) => {
        state.usuarioActivo = null;
        state.departamento = null;
        state.validado = false;
        state.loading = false;
        state.error = "No se pudo consultar el usuario activo";
      })
      .addCase(cerrarSesion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.usuarioActivo = null;
        state.departamento = null;
        state.validado = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        state.loading = false;
        state.error = "Error al cerrar sesión";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
