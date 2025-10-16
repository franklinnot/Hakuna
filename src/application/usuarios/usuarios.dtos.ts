import z from 'zod';
import { RegisterUsuarioSchema } from '../auth/auth.dtos';

export const UpdateUsuarioSchema = RegisterUsuarioSchema.partial();
export type UpdateUsuarioDto = z.infer<typeof UpdateUsuarioSchema>;
