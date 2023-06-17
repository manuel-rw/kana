import { type NextPage } from "next";
import Head from "next/head";

import { Button, Group, Space, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { MainLayout } from "~/layout/main-layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home • Kana</title>
      </Head>

      <MainLayout>
        <HeroBanner />

        <Space h={100} />

        <Stack align="right" maw={500} ml="auto">
          <Title align="right">
            こんにちは!
            <br />
            にほんごをべんきょしましょう
          </Title>
          <Text align="right">
            Although this website is only a small part, what you need to learn
            and use, it will help you understand exercises and is a great
            preparation for Japanese courses for beginners.
          </Text>
        </Stack>
      </MainLayout>
    </>
  );
};

export default Home;

const HeroBanner: React.FC = () => {
  return (
    <Stack spacing={0} mt={100}>
      <Text color="grape" weight="bold" size="xl">
        Easy and fast
      </Text>
      <Title order={1} size="4rem" weight="bolder" mb="lg">
        Learn Hiragana and Katakana
      </Title>
      <Text size="lg">
        Want to read Japanese? Hiragana and Katakana are essential to understand
        the language. Practice only a few minutes each day and you&apos;ll be
        able to read most texts.
      </Text>

      <Group mt="lg">
        <Button rightIcon={<IconArrowRight size="1rem" />} variant="light">
          Start learning
        </Button>
        <Button rightIcon={<IconArrowRight size="1rem" />} variant="flat">
          Sign up
        </Button>
      </Group>
    </Stack>
  );
};
