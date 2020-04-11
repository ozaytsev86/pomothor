import React from 'react';

import logo from '../statics/logo.png';
import {locale} from '../locale/en-us';

export const Home = () => {
 return (
   <div className="u-full-height--centered">
     <img src={logo} alt={locale.Pomothor} />
   </div>
 );
};
