// components/InitAuth.js
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { consultarUsuarioActivo } from "@/store/features/auth/thunks/consultarUsuarioActivo";

export default function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(consultarUsuarioActivo());
  }, [dispatch]);

  return null; // No renderiza nada, solo ejecuta la lógica
}
