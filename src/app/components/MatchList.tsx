import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Divider from "@mui/material/Divider";
import {
  Grid,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  onRoundChange: (newRound: number | null) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  selectedTeam,
  selectedRound,
  onRoundChange,
}) => {
  const [selectedRoundPage, SetSelectedRoundPage] = useState<number | null>(
    selectedRound
  );

  useEffect(() => {
    SetSelectedRoundPage(selectedRound);
  }, [selectedRound]);

  const handleRoundChange = (newRound: number) => {
    SetSelectedRoundPage(newRound);
    onRoundChange(newRound);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const maxRound = Math.max(...matches.map((match) => match.matchday));

  const filteredMatches = matches.filter((match) => {
    const byTeam = selectedTeam
      ? match.homeTeam.name === selectedTeam ||
        match.awayTeam.name === selectedTeam
      : true;
    const byRound =
      selectedRoundPage !== null ? match.matchday === selectedRoundPage : true;
    return byTeam && byRound;
  });

  const groupedMatches = groupMatchesByRound(filteredMatches);

  const formatDate = (isoDate: string) => {
    const date = parseISO(isoDate);

    const dayMonth = format(date, "dd/MM", { locale: ptBR });
    const dayOfWeek = format(date, "EEEE", { locale: ptBR });
    const time = format(date, "HH:mm", { locale: ptBR });

    return `${dayMonth} • ${
      dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    } • ${time}`;
  };

  return (
    <Box>
      {Object.keys(groupedMatches).map((round: any) => (
        <Box key={round} mb={2}>
          {selectedRoundPage !== null ? (
            <Grid padding={"30px 0px 50px 0px"}>
              <Divider />
              <Grid
                display={"flex"}
                justifyContent={"space-between"}
                padding={"10px 0px"}
              >
                <Button
                  onClick={() => handleRoundChange(selectedRoundPage - 1)}
                  disabled={selectedRoundPage === 1}
                  sx={{ color: "green" }}
                >
                  <ArrowBackIosIcon />
                </Button>
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                >{`${round}ª Rodada`}</Typography>
                <Button
                  onClick={() => handleRoundChange(selectedRoundPage + 1)}
                  disabled={selectedRoundPage === maxRound}
                  sx={{ color: "green" }}
                >
                  <ArrowForwardIosIcon />
                </Button>
              </Grid>
              <Divider />
            </Grid>
          ) : (
            <Grid
              display={"flex"}
              flexDirection={"column"}
              textAlign={"center"}
              padding={"0px 0px 50px 0px"}
            >
              <Divider />
              <Grid padding={"10px 0px"}>
                <Typography fontWeight={"bold"} variant="h6">
                  {`${round}ª Rodada`}
                </Typography>
              </Grid>
              <Divider />
            </Grid>
          )}
          <Grid container spacing={6}>
            {groupedMatches[round]?.map((match: Match) => (
              <Grid item key={match.id} xs={12}>
                <Grid textAlign={"center"}>
                  <Typography fontWeight={"bold"} marginBottom={2}>
                    {formatDate(match.utcDate)}
                  </Typography>
                </Grid>
                <Grid width={"100%"} display={"flex"} padding={"0px 20px"}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                    width={"50%"}
                  >
                    <Typography fontWeight={"bold"}>
                      {isMobile
                        ? match.homeTeam.name.substring(0, 3)
                        : match.homeTeam.name}
                    </Typography>
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.crest}
                      style={{ width: "22px", marginLeft: "10px" }}
                    />
                  </Box>
                  <Typography sx={{ margin: "0px 20px" }}>x</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                    width={"50%"}
                  >
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.crest}
                      style={{ width: "22px", marginRight: "10px" }}
                    />
                    <Typography fontWeight={"bold"}>
                      {isMobile
                        ? match.awayTeam.name.substring(0, 3)
                        : match.awayTeam.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Divider sx={{ marginTop: "10px" }} />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

const groupMatchesByRound = (matches: Match[]) => {
  return matches.reduce((acc: { [round: number]: Match[] }, match) => {
    const round = match.matchday;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {});
};

export default MatchList;
