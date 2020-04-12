import './home.css';

import React from 'react';
import {Grid, Typography, Link} from '@material-ui/core';
import {locale} from '../../locale/en-us';

export const Home = () => {
 return (
   <Grid container direction="column">
     <Grid item className="e-home-bg u-height--full u-display--flex u-justify-content--center u-align-items--center">
       <div>
         <Typography variant="h4">
           When walking, walk. When eating, eat.
         </Typography>
         <Typography variant="h3">
           When focusing, focus.
         </Typography>
         <Typography align="right" variant="subtitle1">
           - Zen proverb
         </Typography>
       </div>
       <span className="u-position--absolute u-bottom--0">
         {locale.PhotoBy} <Link href="https://www.instagram.com/avonnephotography/" target="_blank" rel="noopener noreferrer">Avonne Stalling</Link>
       </span>
     </Grid>
   </Grid>
 );
};
