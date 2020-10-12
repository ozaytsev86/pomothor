import React from 'react';
import {Grid, Typography, Link} from '@material-ui/core';

import {locale} from '../../locale/EnUs';

export const Home = () => {
 return (
   <Grid container direction="column">
     <Grid item className="e-bg e-bg-image--home u-height--full u-display--flex u-justify-content--center u-align-items--center">
       <div>
         <Typography variant="h4">
           {locale.WhenWalkingWalkWhenEatingEat}
         </Typography>
         <Typography variant="h3">
           {locale.WhenFocusingFocus}
         </Typography>
         <Typography align="right" variant="subtitle1">
           - {locale.ZenProverb}
         </Typography>
       </div>
       <span className="u-position--absolute u-bottom--0">
         {locale.PhotoBy} <Link href="https://www.pexels.com/@ketut-subiyanto" target="_blank" rel="noopener noreferrer">Ketut Subiyanto</Link>
       </span>
     </Grid>
   </Grid>
 );
};
