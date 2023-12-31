import { Unstable_Grid2 as Grid } from '@mui/material';

import { FC } from 'react';

import { ChatBot } from '../components/Chat';

export const Home: FC = () => {
  return (
    <Grid
      alignItems='center'
      container
      justifyContent='center'
      spacing={4}
      width='100%'>
      <Grid lg={6} xs={12}>
        <ChatBot type='llama' />
      </Grid>
      <Grid lg={6} xs={12}>
        <ChatBot type='openapi' />
      </Grid>
    </Grid>
  );
};
