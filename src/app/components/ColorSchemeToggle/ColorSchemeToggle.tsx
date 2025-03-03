"use client";

import cx from "clsx";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import classes from "./ColorSchemeToggle.module.css";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      size="lg"
      variant="light"
      name="color-scheme-toggle"
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
    >
      <IconSun className={cx(classes.icon, classes.light)} />
      <IconMoonStars className={cx(classes.icon, classes.dark)} />
    </ActionIcon>
  );
}
