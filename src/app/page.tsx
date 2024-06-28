"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import Image from "next/image";
import MatchList from "./components/MatchList";
import TeamFilter from "./components/TeamFilter";
import LoaderSrc from "../../public/jogador.gif";
import RoundFilter from "./components/RoundFilter";
import ChampionshipTable from "./components/ChampionshipTable";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";

interface Competition {
  id: string;
  name: string;
  emblem: string;
}

interface Team {
  id: number;
  name: string;
  crest: string;
}

interface Match {
  id: number;
  utcDate: string;
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
}

interface CustomError {
  message: string;
}
const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const config: AxiosRequestConfig = {
          headers: {
            "X-Auth-Token": "6311a66f5f8746fd8860a5de6173f49f",
          },
        };

        const response = await axios.get(
          `https://api.football-data.org/v4/competitions`,
          config
        );

        setCompetitions(response.data.competitions);
      } catch (err) {
        const error = err as CustomError;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (selectedChampionship) {
      const fetchMatches = async () => {
        setLoading(true);
        try {
          const config: AxiosRequestConfig = {
            headers: {
              "X-Auth-Token": "6311a66f5f8746fd8860a5de6173f49f",
            },
          };

          const response = await axios.get(
            `https://api.football-data.org/v4/competitions/${selectedChampionship}/matches`,
            config
          );

          setMatches(response.data.matches);

          const teamsMap = new Map<number, Team>();
          response.data.matches.forEach((match: Match) => {
            teamsMap.set(match.homeTeam.id, match.homeTeam);
            teamsMap.set(match.awayTeam.id, match.awayTeam);
          });
          const teams = Array.from(teamsMap.values());

          setTeams(teams);

          const roundsSet = new Set<number>();
          response.data.matches.forEach((match: Match) => {
            roundsSet.add(match.matchday);
          });
          const rounds = Array.from(roundsSet);

          setRounds(rounds);
        } catch (err) {
          const error = err as CustomError;
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
      setSelectedTeam(null);
      setSelectedRound(null);
    }
  }, [selectedChampionship]);

  const handleRoundChange = (newRound: number | null) => {
    setSelectedRound(newRound);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Image src={LoaderSrc} alt="loading" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography fontWeight={"bold"} color="error">
          Ocorreu um erro com a aplicação: {error}
        </Typography>
        <Image src={LoaderSrc} alt="loading" />
      </Box>
    );
  }

  let selectedChampionshipNome = "";
  if (selectedChampionship) {
    const selectedComp = competitions.find(
      (comp: Competition) => comp.id === selectedChampionship
    );

    if (selectedComp) {
      selectedChampionshipNome = selectedComp.name;
    }
  }

  return (
    <Grid container spacing={2} justifyContent={"center"}>
      <Grid
        item
        xs={12}
        width={"100%"}
        height={"80px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ background: "#06AA48" }}
      >
        <Typography color={"white"} fontWeight="bold" fontSize="24px">
          Tabela do Campeonato
        </Typography>
      </Grid>

      <Grid
        item
        xs={11}
        display={"flex"}
        justifyContent={"center"}
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
      >
        <Grid item xs={12}>
          <ChampionshipTable
            championships={competitions}
            selectedChampionship={selectedChampionship}
            onSelectChampionship={setSelectedChampionship}
          />
        </Grid>

        {selectedChampionship && (
          <Grid item xs={12}>
            <TeamFilter
              teams={teams}
              onSelectTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </Grid>
        )}

        {selectedChampionship && (
          <Grid item xs={12}>
            <RoundFilter
              rounds={rounds}
              onSelectRound={setSelectedRound}
              selectedRound={selectedRound}
            />
          </Grid>
        )}
      </Grid>
      {!isMobile && (
        <Grid item xs={8}>
          {selectedChampionship && (
            <Grid height={"100%"} sx={{ background: "#001107" }}>
              <Grid
                sx={{
                  backgroundImage: "url(/football.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  width: "100%",
                  height: "1000px",
                }}
              >
                <Grid
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"start"}
                  width={"100%"}
                  height={"100%"}
                  sx={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                  <Typography
                    color={"white"}
                    fontWeight={"bold"}
                    fontSize={"32px"}
                    marginTop={"50px"}
                  >
                    {selectedChampionshipNome}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
      <Grid item xs={!isMobile ? 4 : 12}>
        {selectedChampionship && (
          <>
            <MatchList
              matches={matches}
              selectedTeam={selectedTeam}
              selectedRound={selectedRound}
              onRoundChange={handleRoundChange}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
