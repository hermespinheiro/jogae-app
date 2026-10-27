export type LoginRequest = { identifier: string; password: string };
export type LoginResponse = { userId: string; role: 'Administrador' | 'Editor' | 'Leitor' };
export type EmailChangeRequest = { newEmail: string };
export type EmailChangeConfirmation = { requestId: string; code: string };
