// redux/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modales: {
    crear: false,
    editar: false,
    confirmar: false,
    confirmarCambios: false,
    consultar: false,
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    abrirModal: (state, action) => {
      const id = action.payload;
      state.modales[id] = true;
    },
    cerrarModal: (state, action) => {
      const id = action.payload;
      state.modales[id] = false;
    },
    cerrarTodosLosModales: (state) => {
      Object.keys(state.modales).forEach((id) => {
        state.modales[id] = false;
      });
    },
  },
});

export const { abrirModal, cerrarModal, cerrarTodosLosModales } =
  modalSlice.actions;
export default modalSlice.reducer;
