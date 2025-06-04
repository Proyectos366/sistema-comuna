import { NextResponse } from "next/server";

export function generarRespuesta(status, message, data = {}, statusCode) {
    return NextResponse.json(
      {
        status: status,
        message: message,
        ...data,
      },
      { status: statusCode }
    );
  }
  