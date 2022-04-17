import * as React from 'react';

import {AlertContext} from '../store/alert/Alert.store';

export const useAlertStore = () => React.useContext(AlertContext);
