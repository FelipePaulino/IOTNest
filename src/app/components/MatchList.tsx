import React from "react";
import { Grid, Typography, Checkbox } from "@mui/material";

interface Match {
  id: number;
  utcDate: string;
  matchday: number;
  homeTeam: {
    name: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    crest: string;
  };
}

interface MatchListProps {
  matches: Match[];
  selectedTeam: string | null;
  selectedRound: number | null;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  selectedTeam,
  selectedRound,
}) => {
  const filteredMatches = matches?.filter((match) => {
    const byTeam = selectedTeam
      ? match.homeTeam.name === selectedTeam ||
        match.awayTeam.name === selectedTeam
      : true;
    const byRound = selectedRound ? match.matchday === selectedRound : true;
    return byTeam && byRound;
  });

  const groupedMatches = groupMatchesByRound(filteredMatches);

  return (
    <Grid container spacing={4}>
      {Object.keys(groupedMatches).map((round) => (
        <Grid item xs={12} key={round}>
          <Typography variant="h6">{`${round}ª Rodada`}</Typography>
          {groupedMatches[round].map(
            (match: {
              id: React.Key | null | undefined;
              homeTeam: any;
              awayTeam: any;
            }) => (
              <Grid
                item
                key={match.id}
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid display={"flex"}>
                  <img
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.crest}
                    style={{ width: "22px", marginRight: "10px" }}
                  />
                  <Typography>{match.homeTeam.name}</Typography>
                </Grid>
                <Typography sx={{ margin: "0px 20px" }}>x</Typography>
                <Grid display={"flex"}>
                  <img
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.crest}
                    style={{ width: "22px", marginRight: "10px" }}
                  />
                  <Typography>{match.awayTeam.name}</Typography>
                </Grid>
              </Grid>
            )
          )}
        </Grid>
      ))}
    </Grid>
  );
};

const groupMatchesByRound = (matches: any[]) => {
  return matches.reduce(
    (acc: { [x: string]: any[] }, match: { matchday: any }) => {
      const round = match.matchday;
      if (!acc[round]) {
        acc[round] = [];
      }
      acc[round].push(match);
      return acc;
    },
    {}
  );
};

export default MatchList;
