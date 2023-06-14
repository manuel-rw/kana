import { TextInput, Text, Button, Stack } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { CommonKanaCard } from "./common";

interface CardKanaInputProps {
  kana: string;
  isLoading: boolean;
  onSubmit: (value: string) => Promise<void>;
}

export const CardKanaInput = ({
  kana,
  onSubmit,
  isLoading,
}: CardKanaInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>("");

  const handleSubmit = () => {
    if (!input) {
      return;
    }
    onSubmit(input)
      .then(() => {
        setInput("");
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.focus();
  }, []);

  return (
    <CommonKanaCard>
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
          onKeyDown={getHotkeyHandler([["Enter", handleSubmit]])}
          ref={ref}
        />

        <Button
          onClick={handleSubmit}
          loading={isLoading}
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
    </CommonKanaCard>
  );
};
