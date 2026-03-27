import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import rolesReducer from "@/store/features/roles/rolesSlices";
import usuariosReducer from "@/store/features/usuarios/usuariosSlices";
import authReducer from "@/store/features/auth/authSlice";
import modalReducer from "@/store/features/modal/slicesModal";
import formsReducer from "@/store/features/formularios/formSlices";
import paisesReducer from "@/store/features/paises/paisesSlices";
import estadosReducer from "@/store/features/estados/estadosSlices";
import municipiosReducer from "@/store/features/municipios/municipiosSlices";
import parroquiasReducer from "@/store/features/parroquias/parroquiasSlices";
import institucionesSlices from "@/store/features/instituciones/institucionesSlices";
import departamentosReducer from "@/store/features/departamentos/departamentosSlices";
import cargosReducer from "@/store/features/cargos/cargosSlices";
import formacionesReducer from "@/store/features/formaciones/formacionesSlices";
import comunasReducer from "@/store/features/comunas/comunasSlices";
import circuitosReducer from "@/store/features/circuitos/circuitosSlices";
import consejosReducer from "@/store/features/consejos/consejosSlices";
import vocerosReducer from "@/store/features/voceros/vocerosSlices";
import participantesReducer from "@/store/features/participantes/participantesSlices";
import cursosReducer from "@/store/features/cursos/cursosSlices";
import novedadesReducer from "@/store/features/novedades/novedadesSlices";
import estantesReducer from "@/store/features/estantes/estantesSlices";
import carpetasReducer from "@/store/features/carpetas/carpetasSlices";

// Configurar persistencia solo para estantes
const persistConfigEstantes = {
  key: "estantes",
  storage,
  whitelist: ["estanteActual"], // Solo persiste estanteActual
};

// Configurar persistencia solo para carpetas
const persistConfigCarpetas = {
  key: "carpetas",
  storage,
  whitelist: ["carpetaActual"], // Solo persiste carpetaActual
};

const persistedEstantesReducer = persistReducer(
  persistConfigEstantes,
  estantesReducer,
);
const persistedCarpetasReducer = persistReducer(
  persistConfigCarpetas,
  carpetasReducer,
);

const store = configureStore({
  reducer: {
    roles: rolesReducer,
    usuarios: usuariosReducer,
    auth: authReducer,
    modal: modalReducer,
    forms: formsReducer,
    paises: paisesReducer,
    estados: estadosReducer,
    municipios: municipiosReducer,
    parroquias: parroquiasReducer,
    instituciones: institucionesSlices,
    departamentos: departamentosReducer,
    cargos: cargosReducer,
    formaciones: formacionesReducer,
    comunas: comunasReducer,
    circuitos: circuitosReducer,
    consejos: consejosReducer,
    voceros: vocerosReducer,
    participantes: participantesReducer,
    cursos: cursosReducer,
    novedades: novedadesReducer,
    estantes: persistedEstantesReducer,
    carpetas: persistedCarpetasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;

// import { configureStore } from "@reduxjs/toolkit";

// import rolesReducer from "@/store/features/roles/rolesSlices";
// import usuariosReducer from "@/store/features/usuarios/usuariosSlices";
// import authReducer from "@/store/features/auth/authSlice";
// import modalReducer from "@/store/features/modal/slicesModal";
// import formsReducer from "@/store/features/formularios/formSlices";
// import paisesReducer from "@/store/features/paises/paisesSlices";
// import estadosReducer from "@/store/features/estados/estadosSlices";
// import municipiosReducer from "@/store/features/municipios/municipiosSlices";
// import parroquiasReducer from "@/store/features/parroquias/parroquiasSlices";
// import institucionesSlices from "@/store/features/instituciones/institucionesSlices";
// import departamentosReducer from "@/store/features/departamentos/departamentosSlices";
// import cargosReducer from "@/store/features/cargos/cargosSlices";
// import formacionesReducer from "@/store/features/formaciones/formacionesSlices";
// import comunasReducer from "@/store/features/comunas/comunasSlices";
// import circuitosReducer from "@/store/features/circuitos/circuitosSlices";
// import consejosReducer from "@/store/features/consejos/consejosSlices";
// import vocerosReducer from "@/store/features/voceros/vocerosSlices";
// import participantesReducer from "@/store/features/participantes/participantesSlices";
// import cursosReducer from "@/store/features/cursos/cursosSlices";
// import novedadesReducer from "@/store/features/novedades/novedadesSlices";
// import estantesReducer from "@/store/features/estantes/estantesSlices";

// const store = configureStore({
//   reducer: {
//     roles: rolesReducer,
//     usuarios: usuariosReducer,
//     auth: authReducer,
//     modal: modalReducer,
//     forms: formsReducer,
//     paises: paisesReducer,
//     estados: estadosReducer,
//     municipios: municipiosReducer,
//     parroquias: parroquiasReducer,
//     instituciones: institucionesSlices,
//     departamentos: departamentosReducer,
//     cargos: cargosReducer,
//     formaciones: formacionesReducer,
//     comunas: comunasReducer,
//     circuitos: circuitosReducer,
//     consejos: consejosReducer,
//     voceros: vocerosReducer,
//     participantes: participantesReducer,
//     cursos: cursosReducer,
//     novedades: novedadesReducer,
//     estantes: estantesReducer,
//   },
// });

// export default store;
