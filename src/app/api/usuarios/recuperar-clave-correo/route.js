import { NextResponse } from "next/server";
import ValidarCampos from "@/services/ValidarCampos";
//import { conexion } from "@/libs/database/conexion.js";

export async function POST(request) {
  try {
    const { correo } = await request.json();

    const validarCampoCorreo = ValidarCampos.validarCampoCorreo(correo);

    if (validarCampoCorreo.status === "error") {
      return NextResponse.json(
        {
          status: validarCampoCorreo.status,
          message: validarCampoCorreo.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Correo enviado...",
      redirect: "/",
    })


    // const crearUsuario = await conexion.query(
    //   'INSERT INTO usuarios (cedula, nombre, correo, clave) VALUES ($1, $2, $3, $4) RETURNING *',
    //   [cedula, nombre, correo, clave]
    // );
    // console.log(data);

    // return NextResponse.json({
    //   status: "ok",
    //   message: "Usuario registrado con éxito...",
    //   redirect: '/'
    // },
    // {
    //   status: 201
    // });
  } catch (error) {
    console.log("Error, al guardar nuevo usuario: " + error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error, al crear usuario...",
      },
      { status: 500 }
    );
  }
}
