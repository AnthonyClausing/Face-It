import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import AppRoutes from './routes';

const container  = document.getElementById('app') 
const root = ReactDOM.createRoot(container)

root.render(<Provider store={store}>
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
</Provider>)