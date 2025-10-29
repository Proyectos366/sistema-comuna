import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice";
import usuariosReducer from "@/store/features/usuarios/usuariosSlices";
import institucionesSlices from "@/store/features/instituciones/institucionesSlices";
import departamentosReducer from "@/store/features/departamentos/departamentosSlices";
import rolesReducer from "@/store/features/roles/rolesSlices";
import modalReducer from "@/store/features/modal/slicesModal";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    roles: rolesReducer,
    usuarios: usuariosReducer,
    instituciones: institucionesSlices,
    departamentos: departamentosReducer,
    // Aquí se agregarán los reducers de los "slices"
  },
});

export default store;
