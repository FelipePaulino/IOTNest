"use client";
import Image from "next/image";
import MatchList from "./components/MatchList";
import TeamFilter from "./components/TeamFilter";
import LoaderSrc from "../../public/jogador.gif";
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import RoundFilter from "./components/RoundFilter";
import ChampionshipTable from "./components/ChampionshipTable";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";

interface Competition {
  id: string;
  name: string;
}

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
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
      } catch (err: any) {
        setError(err?.message);
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

          const teamsMap = new Map<number, { name: string; crest: string }>();
          response.data.matches.forEach((match: any) => {
            teamsMap.set(match.homeTeam.id, {
              name: match.homeTeam.name,
              crest: match.homeTeam.crest,
            });
            teamsMap.set(match.awayTeam.id, {
              name: match.awayTeam.name,
              crest: match.awayTeam.crest,
            });
          });
          const teams = Array.from(teamsMap.values());

          setTeams(teams);

          const roundsSet = new Set<number>();
          response.data.matches.forEach((match: any) => {
            roundsSet.add(match.matchday);
          });
          const rounds = Array.from(roundsSet);

          setRounds(rounds);
        } catch (err: any) {
          setError(err?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
      setSelectedTeam(null);
      setSelectedRound(null);
    }
  }, [selectedChampionship]);

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

  return (
    <Box p={2} display="flex" justifyContent="center" width={"100%"}>
      <Box
        width={isMobile ? "100%" : "600px"}
        maxWidth={isMobile ? "100%" : "600px"}
      >
        <Grid textAlign={"center"}>
          <Typography fontWeight="bold" fontSize="24px" mb={2}>
            Tabela do Campeonato
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ChampionshipTable
              championships={competitions}
              selectedChampionship={selectedChampionship}
              onSelectChampionship={setSelectedChampionship}
            />
          </Grid>
          {selectedChampionship && (
            <>
              <Grid item xs={12}>
                <TeamFilter
                  teams={teams}
                  onSelectTeam={setSelectedTeam}
                  selectedTeam={selectedTeam}
                />
              </Grid>
              <Grid item xs={12}>
                <RoundFilter
                  rounds={rounds}
                  onSelectRound={setSelectedRound}
                  selectedRound={selectedRound}
                />
              </Grid>
              <Grid item xs={12}>
                <MatchList
                  matches={matches}
                  selectedTeam={selectedTeam}
                  selectedRound={selectedRound}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
