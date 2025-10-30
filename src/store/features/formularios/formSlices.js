// formsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reiniciarForm: {
    loginForm: 0,
    usuarioForm: 0,
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
