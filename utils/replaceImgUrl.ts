export const replaceImgUrl = (match: any) => {
  if (match.home_team.has_logo) {
    match.home_team.logo = match.home_team.logo.replace(
      "tipsscore.com",
      "xscore.cc"
    );
  }
  if (match.away_team.has_logo) {
    match.away_team.logo = match.away_team.logo.replace(
      "tipsscore.com",
      "xscore.cc"
    );
  }
  if (match.league.has_logo) {
    match.league.logo.replace("tipsscore.com", "xscore.cc");
  }
};