"use client";
import { Container, Stack, Text, Title } from "@mantine/core";
import classes from "./page.module.css";
import { Search } from "@/components/Search/Search";

export default function Home() {
  return (
    <Container size="xl">
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
      <Stack>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
          Search movies using natural language, with a vector store like
          LanceDB.
        </Text>
        <Search />
      </Stack>
    </Container>
  );
}
