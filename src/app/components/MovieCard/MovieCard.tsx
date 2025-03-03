import { IconStarFilled } from "@tabler/icons-react";
import { Card, Center, Group, Text, useMantineTheme } from "@mantine/core";
import classes from "./MovieCard.module.css";

export interface MovieCardProps {
  title: string;
  genres: string;
  tags: string;
  rating: string;
  imdbLink: string;
}

export function MovieCard({
  title,
  genres,
  tags,
  rating,
  imdbLink,
}: MovieCardProps) {
  const theme = useMantineTheme();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component="a"
      href={imdbLink}
      target="_blank"
    >
      <div
        className={classes.image}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)",
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.title} fw={500}>
            {title}
          </Text>

          <Group justify="space-between" gap="xs">
            <Text size="sm" className={classes.author}>
              {genres.replaceAll("|", ", ")}
            </Text>

            <Group gap="lg">
              <Center>
                <IconStarFilled size={16} color={theme.colors.yellow[6]} />
                <Text size="sm" className={classes.bodyText}>
                  {rating}
                </Text>
              </Center>
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  );
}
