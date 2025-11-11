// formsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reiniciarForm: {
    loginForm: 0,
    usuarioForm: 0,
    paisForm: 0,
    estadoForm: 0,
    municipioForm: 0,
    parroquiaForm: 0,
  },
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    resetForm: (state, action) => {
      const formName = action.payload;
      state.reiniciarForm[formName] += 1;
    },
  },
});

export const { resetForm } = formsSlice.actions;
export default formsSlice.reducer;
