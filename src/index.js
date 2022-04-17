import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {AppStoreProvider} from './store/app/App.store';
import {AlertStoreProvider} from './store/alert/Alert.store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {queryClientConfig} from './configs/ReactQuery';
import {BrowserRouter} from 'react-router-dom';

const queryClient = new QueryClient(queryClientConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AlertStoreProvider>
          <AppStoreProvider>
            <App/>
          </AppStoreProvider>
        </AlertStoreProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
