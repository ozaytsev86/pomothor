import * as React from 'react';

import {AppContext} from '../store/app/App.store';

export const useAppStore = () => React.useContext(AppContext);
