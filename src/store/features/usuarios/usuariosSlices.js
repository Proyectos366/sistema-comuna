// features/users/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsuarios } from "@/store/features/usuarios/thunks/todosUsuarios";
import { crearUsuario } from "@/store/features/usuarios/thunks/crearUsuario";
import { cambiarAccesoUsuario } from "@/store/features/usuarios/thunks/cambiarAccesoUsuario";
import { eliminarRestaurarUsuario } from "@/store/features/usuarios/thunks/eliminarRestaurarUsuario";
import { cambiarDepartamentoUsuario } from "@/store/features/usuarios/thunks/cambiarDepartamentoUsuario";
import { cambiarRolUsuario } from "@/store/features/usuarios/thunks/cambiarRolUsuario";
import { fetchUsuariosNombres } from "@/store/features/usuarios/thunks/todosUsuariosNombres";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    usuarios: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsuariosNombres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuariosNombres.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuariosNombres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios.push(action.payload);
      })
      .addCase(crearUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(cambiarAccesoUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cambiarAccesoUsuario.fulfilled, (state, action) => {
        state.loading = false;
        const usuarioActualizado = action.payload;

        const index = state.usuarios.findIndex(
          (u) => u.id === usuarioActualizado.id,
        );
        if (index !== -1) {
          state.usuarios[index] = usuarioActualizado;
        }
      })
      .addCase(cambiarAccesoUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(eliminarRestaurarUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarUsuario.fulfilled, (state, action) => {
        state.loading = false;
        const usuarioActualizado = action.payload;

        const index = state.usuarios.findIndex(
          (u) => u.id === usuarioActualizado.id,
        );
        if (index !== -1) {
          state.usuarios[index] = usuarioActualizado;
        }
      })
      .addCase(eliminarRestaurarUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cambiarDepartamentoUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cambiarDepartamentoUsuario.fulfilled, (state, action) => {
        state.loading = false;
        const usuarioActualizado = action.payload;

        const index = state.usuarios.findIndex(
          (u) => u.id === usuarioActualizado.id,
        );
        if (index !== -1) {
          state.usuarios[index] = usuarioActualizado;
        }
      })
      .addCase(cambiarDepartamentoUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cambiarRolUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cambiarRolUsuario.fulfilled, (state, action) => {
        state.loading = false;
        const usuarioActualizado = action.payload;

        const index = state.usuarios.findIndex(
          (u) => u.id === usuarioActualizado.id,
        );
        if (index !== -1) {
          state.usuarios[index] = usuarioActualizado;
        }
      })
      .addCase(cambiarRolUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
