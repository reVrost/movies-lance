import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";

import { Geist, Geist_Mono } from "next/font/google";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "VectorFlix",
  description: "Search movies with natural language",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider
          theme={{ primaryColor: "orange", fontFamily: "Geist" }}
        >
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
