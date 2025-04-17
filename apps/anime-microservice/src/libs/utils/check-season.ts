export function checkSeason(
  seasonString: string,
): { year: number; season: string | null } | null {
  // Обработка диапазона годов
  const yearRangeMatch = seasonString.match(/^(\d{4})_(\d{4})$/);
  if (yearRangeMatch) {
    const startYear = parseInt(yearRangeMatch[1]);
    const endYear = parseInt(yearRangeMatch[2]);
    return {
      year: startYear,
      season: `range_${endYear}`, // Храним диапазон в формате "range_2025"
    };
  }

  // Обработка сезона с годом
  const seasonYearMatch = seasonString.match(/^(\w+)_(\d{4})$/);
  if (seasonYearMatch) {
    return {
      year: parseInt(seasonYearMatch[2]),
      season: seasonYearMatch[1].toLowerCase(),
    };
  }

  // Простой год
  const singleYearMatch = seasonString.match(/^\d{4}$/);
  if (singleYearMatch) {
    return {
      year: parseInt(singleYearMatch[0]),
      season: null, // null означает "любой сезон"
    };
  }

  // Десятилетие
  const decadeMatch = seasonString.match(/^(\d{3})x$/);
  if (decadeMatch) {
    return {
      year: parseInt(decadeMatch[1]) * 10,
      season: 'decade',
    };
  }

  return null;
}
