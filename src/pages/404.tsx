import { Center, Image, Stack, Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/layout/main-layout";

const Custom404Page: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Not found (404) • Kana</title>
      </Head>
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
