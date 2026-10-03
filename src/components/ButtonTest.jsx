import { Button, Stack } from '@mui/material'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

export default function ButtonTest() {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
      <Button variant="contained" startIcon={<NearMeRoundedIcon />}>Use my location</Button>
      <Button variant="outlined" startIcon={<RefreshRoundedIcon />}>Refresh</Button>
      <Button variant="text" startIcon={<FavoriteRoundedIcon />}>Save city</Button>
    </Stack>
  )
}
