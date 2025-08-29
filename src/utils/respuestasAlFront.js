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

export function generarRespuestaBinaria(buffer, mimeType, statusCode = 200) {
  return new NextResponse(buffer, {
    status: statusCode,
    headers: {
      "Content-Type": mimeType,
    },
  });
}
