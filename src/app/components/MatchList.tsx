import React from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box>
      {Object.keys(groupedMatches)?.map((round) => (
        <Box key={round} mb={2}>
          <Grid display={"flex"} justifyContent={"center"} padding={"50px 0px"}>
            <Typography variant="h6">{`${round}ª Rodada`} </Typography>
          </Grid>
          <Grid container spacing={2}>
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
                  <Box display="flex" alignItems="center" width={"50%"}>
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.crest}
                      style={{ width: "22px", marginRight: "10px" }}
                    />
                    <Typography>
                      {isMobile ? match.homeTeam.tla : match.homeTeam.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ margin: "0px 20px" }}>x</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"flex-end"}
                    width={"50%"}
                  >
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.crest}
                      style={{ width: "22px", marginRight: "10px" }}
                    />
                    <Typography>
                      {isMobile ? match.awayTeam.tla : match.awayTeam.name}
                    </Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>
      ))}
    </Box>
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
