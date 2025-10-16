export type PhotoAction =
  | { action: 'none' }
  | { action: 'set'; b64: string }
  | { action: 'remove' };
