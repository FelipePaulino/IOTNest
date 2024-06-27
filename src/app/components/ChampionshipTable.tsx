import React from "react";
import {
  MenuItem,
  Select,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mb={2}>
      <Typography variant="h6">Selecione o campeonato</Typography>
      <Select
        fullWidth
        value={selectedChampionship ?? ""}
        onChange={(e) => onSelectChampionship(e.target.value as string)}
        displayEmpty
      >
        <MenuItem value="">Selecione o campeonato</MenuItem>
        {championships?.map((championship: any) => (
          <MenuItem key={championship?.id} value={championship?.id}>
            <img
              src={championship?.emblem}
              alt="emblem"
              style={{ width: "22px", marginRight: isMobile ? "5px" : "20px" }}
            />
            {championship?.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ChampionshipTable;
