export type NextMatch  = {
  awayTeam: {
    crest: string;
    name: string;
    id: number;
  };
  homeTeam: {
    crest: string;
    name: string;
    id: number;
  };
  competition: {
    name: string;
  };
  matchday: number;
  utcDate: string;
  followedTeamId: number;
}

export interface NextMatchFullData {
    matches: NextMatch[]
}
