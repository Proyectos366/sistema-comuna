export default function retornarRespuestaFunciones(status, message, data = {}) {
  return {
    status: status,
    message: message,
    ...data,
  };
}
