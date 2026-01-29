// // features/auth/thunks/consultarUsuarioActivo.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const consultarUsuarioActivo = createAsyncThunk(
//   "auth/consultarUsuarioActivo",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/api/usuarios/usuario-activo");

//       if (response?.data?.status === "ok") {
//         return {
//           usuario: response.data.usuarioActivo,
//           departamento: response.data.departamento,
//           validado: true,
//         };
//       } else {
//         return rejectWithValue("Respuesta inválida");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.status || "Error desconocido");
//     }
//   }
// );

// thunks/consultarUsuarioActivo.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const consultarUsuarioActivo = createAsyncThunk(
  "auth/consultarUsuarioActivo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/usuarios/usuario-activo");

      return {
        usuario: response.data.usuarioActivo,
        departamento: response.data.departamento,
        validado: true,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error de usuario activo",
      );
    }
  },
);
