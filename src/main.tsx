import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import Router from './router';
import {  HelmetProvider } from 'react-helmet-async';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
           <HelmetProvider>
                <Router />
            </HelmetProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </React.StrictMode>
);
