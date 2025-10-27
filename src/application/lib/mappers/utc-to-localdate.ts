export function formatLocalDate(
  date: Date,
  mode: 'time' | 'date' | 'time-date',
): string | null {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.log('El parámetro debe ser una instancia válida de Date');
    return null;
  }

  // Obtener hora local
  const localDate = new Date(date);

  const hours24 = localDate.getHours();
  const minutes = localDate.getMinutes();

  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const hh = hours12.toString();
  const mm = minutes.toString().padStart(2, '0');
  const timeStr = `${hh}:${mm} ${ampm}`;

  const day = localDate.getDate().toString().padStart(2, '0');
  const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
  const year = localDate.getFullYear().toString().slice(-2);
  const dateStr = `${day}/${month}/${year}`;

  switch (mode) {
    case 'time':
      return timeStr;
    case 'date':
      return dateStr;
    case 'time-date':
      return `${timeStr} ${dateStr}`;
    default:
      console.log(`Modo inválido: ${mode}`);
      return null;
  }
}
