"use client"

import * as React from "react"
import App from "../app";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {clientId} from "../lib/constants";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

export default function index() {
  return <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={clientId}>
      <App/>
    </GoogleOAuthProvider>
    <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
}