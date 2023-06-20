import { Card, Flex, Group, Space, Stack, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { type NextPage } from "next";
import { getSession, useSession, type GetSessionParams } from "next-auth/react";
import Head from "next/head";
import { UserCardImage } from "~/components/profile/profile-card";
import { StatsGroup } from "~/components/profile/profile-stats";
import { MainLayout } from "~/layout/main-layout";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data } = api.profile.getStats.useQuery();

  if (!sessionData || !sessionData.user || !sessionData.user.name || !data) {
    return null;
  }

  return (
    <MainLayout>
      <Head>
        <title>{sessionData.user.name} • Profile</title>
      </Head>

      <Space h="xl" />

      <UserCardImage
        avatar={sessionData.user.image}
        image={sessionData.user.image}
        name={sessionData.user.name}
        roles={sessionData.user.roles}
      />

      <Space h="md" />

      <StatsGroup
        data={[
          {
            title: "Kana solutions submitted",
            description: "You've submitted this many solutions for Kanas",
            stats: data.countTotalKanaSolutions.toFixed(),
          },
          {
            title: "Accuracy",
            description: `Your solutions were ${data.countCorrectKanaSolutions} out of ${data.countTotalKanaSolutions} times correct.`,
            stats: `${data.accuracy * 100}%`,
          },
        ]}
      />

      {data.mostFrequentMistake && (
        <Card
          withBorder
          radius="md"
          padding="xl"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          })}
          mt="md"
        >
          <Group spacing={50} align="stretch" style={{ flexWrap: "nowrap" }}>
            <Text size={100} lh={1}>
              {data.mostFrequentMistake.original}
            </Text>
            <Flex w="auto" direction="column" justify="space-between">
              <Stack spacing={0} mb="md">
                <Text fz="lg" fw="bold">
                  Most frequent mistake
                </Text>
                <Text>
                  You failed this Kana {data.mostFrequentMistake.count} times.
                  Don&apos;t worry! Keep on studying. If you struggle, repeat
                  similar characters multiple times and use paper to note your
                  mistakes.
                </Text>
              </Stack>
              <Group spacing="md">
                <Text color="dimmed">{data.mostFrequentMistake.original}</Text>
                <IconArrowRight size="1rem" opacity={0.5} />
                <Text color="dimmed">{data.mostFrequentMistake.roumaji}</Text>
              </Group>
            </Flex>
          </Group>
          <Group></Group>
        </Card>
      )}
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
