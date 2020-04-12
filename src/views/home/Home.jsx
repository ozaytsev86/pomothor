import './home.css';

import React from 'react';
import {Grid, Typography} from '@material-ui/core';

export const Home = () => {
 return (
   <Grid container direction="column">
     <Grid item className="u-full-height--centered e-home-bg">
       <div>
         <Typography variant="h4">
           When walking, walk. When eating, eat.
         </Typography>
         <Typography variant="h3">
           When focusing, focus.
         </Typography>
         <Typography variant="subtitle1">
           - Zen proverb
         </Typography>
       </div>
     </Grid>
   </Grid>
 );
};
