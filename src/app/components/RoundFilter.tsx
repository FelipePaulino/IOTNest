import React from "react";
import { MenuItem, Select, Typography } from "@mui/material";

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
  const handleSelectRound = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    onSelectRound(value === "Todos" ? null : parseInt(value));
  };

  return (
    <div>
      <Typography variant="h6">Selecione a Rodada</Typography>
      <Select
        fullWidth
        value={selectedRound !== null ? selectedRound.toString() : "Todos"}
        onChange={handleSelectRound}
      >
        <MenuItem value="Todos">Todos</MenuItem>
        {rounds.map((round) => (
          <MenuItem key={round} value={round?.toString()}>
            {round}° Rodada
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default RoundFilter;
