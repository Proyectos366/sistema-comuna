import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk modificado para recibir múltiples parámetros
export const crearImgPerfilUsuario = createAsyncThunk(
  "usuarios/crearImgPerfilUsuario",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("imagen", data.nuevaImgPerfil.imagen);

      const response = await axios.post(
        "/api/usuarios/actualizar-img-perfil-usuario",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      data.notify(response?.data?.message);
      thunkAPI.dispatch(data.cerrarModal("confirmar"));

      return response.data.usuarios;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message ||
        error.message ||
        "Error al subir imagen de perfil";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Thunk para crear la imagen de perfil del usuario
// export const crearImgPerfilUsuario = createAsyncThunk(
//   "usuarios/crearImgPerfilUsuario",
//   async (data, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       formData.append("imagen", data.nuevaImgPerfil);

//        const response = await axios.post(
//          "/api/usuarios/actualizar-img-perfil-usuario",
//          formData,
//          {
//            headers: {
//              "Content-Type": "multipart/form-data",
//            },
//          },
//        );

//       data.notify(response?.data?.message);
//       data.setAccion("");
//       thunkAPI.dispatch(data.cerrarModal("editar"));

//       return response.data.usuarios;
//     } catch (error) {
//       data.notify(error?.response?.data?.message);
//       return thunkAPI.rejectWithValue(
//         error?.response?.data?.message || "Error al crear imagen de perfil",
//       );
//     }
//   },
// );
