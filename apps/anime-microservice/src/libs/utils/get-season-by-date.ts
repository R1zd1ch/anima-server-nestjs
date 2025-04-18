export function getSeasonByDate(date: string): string {
  const airedDate = new Date(date);
  const year = airedDate.getFullYear();
  const month = airedDate.getMonth() + 1;

  let season: 'winter' | 'spring' | 'summer' | 'fall';

  if (month === 12 || month === 1 || month === 2) {
    season = 'winter';
  } else if (month >= 3 && month <= 5) {
    season = 'spring';
  } else if (month >= 6 && month <= 8) {
    season = 'summer';
  } else {
    season = 'fall';
  }

  return `${season}_${year}`;
}
