import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";
import Head from "next/head";

import Navigation from "../components/Navigation";

// Axios Interceptor for global Authorization header
import "@/utils/axiosClient";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Pages where the navbar should NOT appear
  const hideNavOn = [
    "/auth/login",
    "/auth/register",
    "/onboarding"
  ];

  const showNavbar = !hideNavOn.includes(router.pathname);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="CAPSTACK - AI-Powered Personal Finance Platform" />
          <meta name="theme-color" content="#007AF7" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="icon"
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23007AF7'/%3E%3Ctext x='12' y='16' font-size='12' text-anchor='middle' fill='white'%3ECS%3C/text%3E%3C/svg%3E"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </Head>
        <CssBaseline />
        {/* Global Navigation Bar */}
        {showNavbar && <Navigation />}

        {/* Render actual page */}
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
