"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import axios, { AxiosRequestConfig } from "axios";
import ChampionshipTable from "./components/ChampionshipTable";
import TeamFilter from "./components/TeamFilter";
import RoundFilter from "./components/RoundFilter";
import MatchList from "./components/MatchList";

interface Competition {
  id: string;
  name: string;
}

function Home() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

          const teams = [
            ...new Map(
              response.data.matches.flatMap(
                (match: {
                  homeTeam: { id: any; name: any; crest: any };
                  awayTeam: { id: any; name: any; crest: any };
                }) => [
                  [
                    match.homeTeam.id,
                    { name: match.homeTeam.name, crest: match.homeTeam.crest },
                  ],
                  [
                    match.awayTeam.id,
                    { name: match.awayTeam.name, crest: match.awayTeam.crest },
                  ],
                ]
              )
            ).values(),
          ];

          setTeams(teams);

          const rounds = [
            ...new Set(
              response.data.matches.map(
                (match: { matchday: any }) => match.matchday
              )
            ),
          ];
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
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography fontWeight={"bold"} fontSize={"24px"}>
          Tabela do Campeonato
        </Typography>
      </Grid>
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
  );
}

export default Home;
