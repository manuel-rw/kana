import { Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/layout/main-layout";

const KanaPage: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz • Kana</title>
      </Head>
      <Title>Practice Hiragana</Title>
    </MainLayout>
  );
};

export default KanaPage;