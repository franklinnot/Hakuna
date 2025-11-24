export const getFileIconPath = (extension: string): string => {
  const extensionMap: Record<string, string> = {
    js: 'js-file.png',
    ppt: 'ppt.png',
    sql: 'sql.png',
    txt: 'txt.png',
    xls: 'xls.png',
    zip: 'zip.png',
    pdf: 'pdf.png',
    docx: 'docx.png',
  };

  const fileName = extensionMap[extension.toLowerCase()] || 'unknown.png';
  return `/icons/files/${fileName}`;
};
