import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";

export interface SearchProps extends TextInputProps {
  onSearch: () => void;
}

export function Search({ onSearch, ...props }: SearchProps) {
  return (
    <TextInput
      radius="sm"
      size="md"
      placeholder="Search questions"
      rightSectionWidth={42}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color="orange"
          variant="filled"
          onClick={onSearch}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          onSearch();
          e.preventDefault();
        }
      }}
      {...props}
    />
  );
}
