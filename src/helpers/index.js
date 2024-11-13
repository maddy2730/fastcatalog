export const pageCounter = (totalCount = 0, rowsPerPage = 10) => {
  // If totalCount or rowsPerPage is 0 or falsy, return an empty array
  if (!totalCount || !rowsPerPage || rowsPerPage <= 0) return [];

  // Calculate the number of pages
  const pageCount = Math.ceil(totalCount / rowsPerPage);

  // Generate the result array based on page count
  const result = Array.from(
    { length: pageCount },
    (_, i) => Math.min((i + 1) * rowsPerPage, totalCount)
  );

  return result;
};

