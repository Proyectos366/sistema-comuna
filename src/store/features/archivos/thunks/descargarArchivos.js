import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para descargar el archivo por id con manejo de errores
export const descargarArchivo = createAsyncThunk(
  "archivos/descargarArchivo",
  async (data, { rejectWithValue }) => {
    try {
      if (!data.idArchivo) {
        return rejectWithValue("ID de archivo no proporcionado");
      }

      const response = await axios.get(`/api/archivos/descargar-archivo`, {
        params: { idArchivo: data.idArchivo },
        responseType: "blob",
      });

      const contentDisposition =
        response.headers["content-disposition"] || "";
      const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''?)?"?([^";\n]*)/i);
      const filename = filenameMatch?.[1]
        ? decodeURIComponent(filenameMatch[1])
        : `archivo_${data.idArchivo}`;

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { idArchivo: data.idArchivo, filename };
    } catch (error) {
      data.notify(error?.response?.data.message);
      return rejectWithValue(
        error.response?.data?.message || "Error al descargar archivo por id",
      );
    }
  },
);
