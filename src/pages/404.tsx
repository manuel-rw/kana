import { Center, Image, Stack, Title } from "@mantine/core";
import { NextPage } from "next";
import { MainLayout } from "~/layout/main-layout";

const Custom404Page: NextPage = () => {
  return (
    <MainLayout>
      <Center h="100%" w="100%">
        <Stack align="center" spacing="xl">
          <Image
            height={300}
            width="auto"
            src="/img/undraw_page_not_found_re_e9o6.svg"
            alt=""
          />
          <Title align="center">Your page was not found</Title>
        </Stack>
      </Center>
    </MainLayout>
  );
};

export default Custom404Page;
