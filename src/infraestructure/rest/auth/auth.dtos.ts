import { z } from 'zod';

// Esquemas
export const LoginSchema = z.object({
  username: z.string().min(2, 'Ingresa un usuario válido.'),
  password: z.string().min(6, 'La contraseña es muy corta.'),
});

export const RegisterUsuarioSchema = z.object({
  foto: z.base64('La imagen no es válida.').optional(),
  nombre: z.string().min(2, 'Ingresa tu nombre completo.'),
  username: z.string().min(2, 'El usuario debe tener al menos 2 caracteres.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

// Tipos inferidos
export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterUsuarioDto = z.infer<typeof RegisterUsuarioSchema>;
