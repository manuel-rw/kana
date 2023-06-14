import { TextInput, Text, Button, Stack, Flex, Container, Center } from "@mantine/core";
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
      <Flex align="center" direction="column" gap="md" h="100%">
        <Center style={{ flexGrow: 1 }}>
          <Text size={128}>{kana}</Text>
        </Center>

        <TextInput
          onKeyDown={getHotkeyHandler([["Enter", handleSubmit]])}
          onChange={(value) => {
            setInput(value.target.value);
          }}
          value={input}
          ref={ref}
          placeholder="Romanji / ろまんじ"
          variant="filled"
          w="100%"
        />

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          variant="light"
          type="submit"
          color="blue"
          radius="md"
          fullWidth
        >
          Submit
        </Button>
      </Flex>
    </CommonKanaCard>
  );
};
