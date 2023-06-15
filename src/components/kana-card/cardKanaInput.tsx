import {
  TextInput,
  Text,
  Button,
  Flex,
  Center,
  Stack,
  Group,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { CommonKanaCard } from "./common";
import { IconAlertCircle } from "@tabler/icons-react";

interface CardKanaInputProps {
  kana: string;
  isLoading: boolean;
  stepsUntilSolution: number;
  solution?: string;
  onSubmit: (value: string) => Promise<void>;
}

export const CardKanaInput = ({
  kana,
  stepsUntilSolution,
  solution,
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
          <Stack align="center">
            <Text size={128}>{kana}</Text>

            {stepsUntilSolution > 0 && (
              <Text align="center" color="dimmed">
                {stepsUntilSolution} tries until solution
              </Text>
            )}

            {solution && (
              <Stack spacing={0}>
                <Text align="center" color="dimmed" size="xs">
                  Solution:
                </Text>

                <Text align="center" color="dimmed">
                  {solution}
                </Text>
              </Stack>
            )}
          </Stack>
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
