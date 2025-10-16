import z from 'zod';

export const UpdateUsuarioSchema = z.object({
  foto: z.string().base64('La imagen no es válida.').nullable().optional(),
  nombre: z.string().min(2, 'Ingresa tu nombre completo.').optional(),
  username: z
    .string()
    .min(2, 'El usuario debe tener al menos 2 caracteres.')
    .optional(),
});

export type UpdateUsuarioDto = z.infer<typeof UpdateUsuarioSchema>;
