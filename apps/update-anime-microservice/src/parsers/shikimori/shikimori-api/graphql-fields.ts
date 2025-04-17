export const animeFields = `
                  id
                  malId
                  name
                  russian
                  licenseNameRu
                  english
                  japanese
                  synonyms
                  kind
                  rating
                  score
                  status
                  episodes
                  episodesAired
                  duration
                  airedOn { date }
                  releasedOn { date }
                  url
                  season

                  poster { id originalUrl mainUrl }

                  nextEpisodeAt,
                  isCensored

                  genres { id name russian kind }
                  studios { id name imageUrl }

                  externalLinks {
                    id
                    kind
                    url
                    createdAt
                    updatedAt
                  }

                  related {
                    id
                    anime {
                      id
                      name
                    }
                    relationKind
                    relationText
                  }


                  videos { id url name kind playerUrl imageUrl }
                  screenshots { id originalUrl x332Url }

                  scoresStats { score count }
                  statusesStats { status count }

                  description
`;
