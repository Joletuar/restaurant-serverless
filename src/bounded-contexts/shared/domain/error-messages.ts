import type { ErrorCode } from './error-code.enum';

export const ErrorMessages: Record<ErrorCode, string> = {
  '001': 'Ha ocurrido un error inesperado, intenta más tarde.',
  '002': 'Los datos no cumplen las reglas de negocio.',
  '003': 'No se ha encontrado la entidad.',
};
