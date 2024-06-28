import React from "react";
import { MenuItem, Select, Typography, Box } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface TeamFilterProps {
  teams: { name: string; crest: string }[];
  onSelectTeam: (team: string | null) => any;
  selectedTeam: string | null;
}

const TeamFilter: React.FC<TeamFilterProps> = ({
  teams,
  onSelectTeam,
  selectedTeam,
}) => {
  const handleSelectTeam = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onSelectTeam(value === "Todos" ? null : value);
  };

  return (
    <Box mb={2}>
      <Typography variant="h6">Selecione a Equipe</Typography>
      <Select
        fullWidth
        value={selectedTeam ?? "Todos"}
        onChange={handleSelectTeam}
        sx={{ height: "50px" }}
      >
        <MenuItem value="Todos">Todos</MenuItem>
        {teams.map((team) => (
          <MenuItem key={team.name} value={team.name}>
            <img
              src={team.crest}
              alt={team.name}
              style={{ width: "22px", marginRight: "10px" }}
            />
            {team.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default TeamFilter;
