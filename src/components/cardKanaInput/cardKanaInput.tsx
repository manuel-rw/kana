import { Card, TextInput, Text, Button, Stack } from "@mantine/core";
import { useState } from "react";

interface CardKanaInputProps {
  kana: string;
  onSubmit: (value: string) => void;
}

export const CardKanaInput = ({ kana, onSubmit }: CardKanaInputProps) => {
  const [input, setInput] = useState<string>();

  return (
    <Card w="30%" padding="lg" radius="md">
        <Stack align="center">
          <Text size={128}>{kana}</Text>

          <TextInput
            size="xl"
            w="90%"
            placeholder="Translation"
            onChange={(value) => {
              setInput(value.target.value);
            }}
            value={input}
          />

          <Button
            onClick={() => {
              if (!input) {
                return;
              }
              onSubmit(input);
            }}
            type="submit"
            size="lg"
            w="90%"
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
          >
            Validate
          </Button>
        </Stack>
    </Card>
  );
};
