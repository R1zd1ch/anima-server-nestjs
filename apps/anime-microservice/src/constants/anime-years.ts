export const years = getYearsFrom1995ToNow();

function getYearsFrom1995ToNow(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = 1995; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}
