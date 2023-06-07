import {
  Avatar,
  Image,
  Card,
  Title,
  Text,
  Overlay,
  Stack,
  Box,
} from "@mantine/core";
import { type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { MainLayout } from "~/layout/main-layout";

const ProfilePage: NextPage = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <MainLayout>
      <Head>
        <title>{data.user.name} • Profile</title>
      </Head>
      <Box maw={600} mx="auto">
        <Card mb="md">
          <Card.Section h={200} pos="relative">
            <Image
              src={data.user.image}
              w="100%"
              h="100%"
              fit="cover"
              alt=""
              style={{ filter: 'blur(6px)' }}
            />

            <Overlay
              sx={(theme) => ({
                backgroundImage: theme.fn.gradient({
                  from: "transparent",
                  to: `${theme.colors.dark[9]}60`,
                  deg: 180,
                }),
                backgroundColor: "transparent",
              })}
              p="md"
            >
              <Stack justify="end" h="100%">
                <Avatar src={data.user.image} />
                <Stack spacing={0}>
                  <Text color="white" size="lg" weight="bold">
                    {data.user.name}
                  </Text>
                  <Text color="white">Level 1</Text>
                </Stack>
              </Stack>
            </Overlay>
          </Card.Section>
        </Card>
        <Title order={2}>Achievements</Title>
      </Box>
    </MainLayout>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default ProfilePage;
