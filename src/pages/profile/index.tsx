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
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { MainLayout } from "~/layout/main-layout";

const ProfilePage: NextPage = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <MainLayout>
      <Box maw={600} mx="auto">
        <Card mb="md">
          <Card.Section h={200} pos="relative">
            <Image
              src="https://source.unsplash.com/featured/?hiragana"
              w="100%"
              h="100%"
              fit="cover"
              alt=""
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
                <Avatar />
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

export default ProfilePage;
