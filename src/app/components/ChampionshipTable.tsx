import React from "react";
import { MenuItem, Select, Typography } from "@mui/material";

interface ChampionshipTableProps {
  championships: any;
  selectedChampionship: string | null;
  onSelectChampionship: (championshipId: string) => void;
}

const ChampionshipTable: React.FC<ChampionshipTableProps> = ({
  championships,
  selectedChampionship,
  onSelectChampionship,
}) => {
  return (
    <div>
      <Typography variant="h6">Selecione o Campeonato</Typography>
      <Select
        fullWidth
        value={selectedChampionship}
        onChange={(e) => onSelectChampionship(e.target.value as string)}
        defaultValue=""
      >
        <MenuItem value="">Selecione o Campeonato</MenuItem>
        {championships?.map((championship: any) => (
          <MenuItem key={championship?.id} value={championship?.id}>
            <img
              src={championship?.emblem}
              alt="emblem"
              style={{ width: "22px", marginRight: "20px" }}
            />
            {championship?.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default ChampionshipTable;
