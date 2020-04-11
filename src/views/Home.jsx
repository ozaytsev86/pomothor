import React from 'react';

import {locale} from '../locale/en-us';
import logo from '../statics/images/logo.png';

export const Home = () => {
 return (
   <div className="u-full-height--centered">
     <img src={logo} alt={locale.Pomothor} />
   </div>
 );
};
