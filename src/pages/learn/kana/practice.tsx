import {
  ActionIcon,
  Center,
  DefaultMantineColor,
  Flex,
  Group,
  Loader,
  MantineTheme,
  Progress,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { CardKanaInput } from "~/components/kana-card/cardKanaInput";
import { CommonKanaCard } from "~/components/kana-card/common";
import { MainLayout } from "~/layout/main-layout";
import Custom404Page from "~/pages/404";
import { api } from "~/utils/api";

const paramSchema = z.object({
  kanaTypes: z.string().transform((value) => value.split(",")),
});

const PracticeKanaPage: NextPage = () => {
  const { query } = useRouter();

  const result = paramSchema.safeParse(query);

  const { mutateAsync, mutate, data, isLoading } =
    api.kanaSolutions.hello.useMutation();

  const [localStats, setLocalStats] = useState<{
    incorrect: number;
    correct: number;
  }>({
    correct: 0,
    incorrect: 0,
  });

  useEffect(() => {
    if (!result.success) {
      return;
    }

    mutate({
      kanaId: "",
      proposal: "",
      isInitialRequest: true,
    });
  }, [result.success]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!data.proposalIsCorrect) {
      setLocalStats({ ...localStats, incorrect: localStats.incorrect + 1 });
      return;
    }
    setLocalStats({ ...localStats, correct: localStats.correct + 1 });
  }, [data]);

  if (!result.success) {
    return <Custom404Page />;
  }

  if (!data) {
    return (
      <MainLayout>
        <Head>
          <title>Kana Quiz (active) • Kana</title>
        </Head>

        <CommonElements localStats={localStats}>
          <CommonKanaCard>
            <Center h="100%">
              <Loader />
            </Center>
          </CommonKanaCard>
        </CommonElements>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz (active) • Kana</title>
      </Head>

      <CommonElements localStats={localStats}>
        <CardKanaInput
          kana={data.nextKana.original}
          isLoading={isLoading}
          onSubmit={async (value) => {
            await mutateAsync({
              proposal: value,
              isInitialRequest: false,
              kanaId: data.nextKana.id,
            });
          }}
        />
      </CommonElements>
    </MainLayout>
  );
};

const CommonElements = ({
  children,
  localStats,
}: {
  localStats: LocalStats;
  children: ReactNode;
}) => {
  const theme = useMantineTheme();

  const total = localStats.correct + localStats.incorrect;
  const progressValue = (localStats.correct / total) * 100;

  const progressColor = getProgressBarColor(progressValue, theme);

  return (
    <Flex h="100%" direction="column">
      <Group mb="md">
        <ActionIcon variant="default">
          <IconArrowLeft />
        </ActionIcon>
        <Stack spacing={0}>
          <Text weight="bold" mb={-5}>
            Practicing Kana
          </Text>
          <Text color="dimmed" size="xs">
            {Math.round(progressValue)}% accuracy, {total} answers
          </Text>
        </Stack>
      </Group>

      <Stack spacing={5}>
        <Progress value={progressValue} color={progressColor.color} />
        <Text color={progressColor.color} align="center" size="sm">{progressColor.text}</Text>
      </Stack>

      <Center h="100%">{children}</Center>
    </Flex>
  );
};

const getProgressBarColor = (
  progress: number,
  theme: MantineTheme
): { color: DefaultMantineColor; text: string } => {
  if (progress < 30) {
    return {
      color: theme.colors.red[5],
      text: "Consider learning a smaller batch of Kana",
    };
  }

  if (progress < 60) {
    return {
      color: theme.colors.orange[4],
      text: "C'mon, you can do better!",
    };
  }

  if (progress < 90) {
    return {
      color: theme.colors.green[5],
      text: "You're learning. Keep up the work!",
    };
  }

  return {
    color: theme.colors.green[8],
    text: "You're doing awesome!",
  };
};

type LocalStats = {
  incorrect: number;
  correct: number;
};

export default PracticeKanaPage;
