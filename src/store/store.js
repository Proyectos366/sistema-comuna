import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice";
import usuariosReducer from "@/store/features/usuarios/usuariosSlices";
import paisesReducer from "@/store/features/paises/paisesSlices";
import institucionesSlices from "@/store/features/instituciones/institucionesSlices";
import departamentosReducer from "@/store/features/departamentos/departamentosSlices";
import rolesReducer from "@/store/features/roles/rolesSlices";
import modalReducer from "@/store/features/modal/slicesModal";
import formsReducer from "@/store/features/formularios/formSlices";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    forms: formsReducer,
    roles: rolesReducer,
    usuarios: usuariosReducer,
    paises: paisesReducer,
    instituciones: institucionesSlices,
    departamentos: departamentosReducer,
    // Aquí se agregarán los reducers de los "slices"
  },
});

export default store;
