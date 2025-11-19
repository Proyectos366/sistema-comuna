// features/roles/rolesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "@/store/features/roles/thunks/todosRoles";
import { crearRol } from "@/store/features/roles/thunks/crearRol";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchRoles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // crearRol
      .addCase(crearRol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearRol.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(crearRol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default rolesSlice.reducer;
