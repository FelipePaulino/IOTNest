import React from "react";
import { MenuItem, Select, Typography, Box } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface RoundFilterProps {
  rounds: number[];
  onSelectRound: (round: number | null) => void;
  selectedRound: number | null;
}

const RoundFilter: React.FC<RoundFilterProps> = ({
  rounds,
  onSelectRound,
  selectedRound,
}) => {
  const handleSelectRound = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onSelectRound(value === "Todos" ? null : parseInt(value));
  };

  return (
    <Box mb={2}>
      <Typography variant="h6">Selecione a rodada</Typography>
      <Select
        fullWidth
        value={selectedRound !== null ? selectedRound.toString() : "Todos"}
        onChange={handleSelectRound}
        sx={{ height: "50px" }}
      >
        <MenuItem value="Todos">Todos</MenuItem>
        {rounds.map((round) => (
          <MenuItem key={round} value={round?.toString()}>
            {round}° Rodada
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default RoundFilter;
