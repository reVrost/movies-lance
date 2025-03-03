"use client";
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import classes from "./page.module.css";
import { Search } from "@/app/components/Search/Search";
import { useState } from "react";
import { MovieCard } from "./components/MovieCard/MovieCard";
import { notifications } from "@mantine/notifications";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle/ColorSchemeToggle";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const handleSetup = () => {
    setIsSettingUp(true);
    fetch("/api/setup", {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        notifications.show({
          title: "Success",
          message: "Embedding done. DB has been successfully setup.",
          position: "top-right",
          color: "green",
        });
        setIsSettingUp(false);
      });
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  return (
    <Container size="xl" mt="lg" mb="lg">
      <Group justify="flex-end">
        <ColorSchemeToggle />
        <Button onClick={handleSetup} variant="light" loading={isSettingUp}>
          Setup DB
        </Button>
      </Group>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          VectorFlix
        </Text>
      </Title>
      <Stack gap="md">
        <Text
          c="dimmed"
          ta="center"
          size="md"
          maw={580}
          mx="auto"
          mt="xl"
          mb="xl"
        >
          Search movies using natural language, with a vector store like
          LanceDB. If it is your first time running please run 'Setup DB' on top
          right. It may take a few minutes to setup the database.
        </Text>
        <Search
          onSearch={handleSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        {isSearching ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            {movies.map((x: any) => (
              <MovieCard
                key={x.title}
                title={x.title}
                genres={x.genres}
                tags={x.tags}
                rating={x.avgRating}
                imdbLink={x.imdbLink}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
