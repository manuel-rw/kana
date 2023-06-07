import { type NextPage } from "next";
import Head from "next/head";
import { CardKanaInput } from "~/components/cardKanaInput/cardKanaInput";
import { MainLayout } from "~/layout/main-layout";

const PracticeKanaPage: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz (active) • Kana</title>
      </Head>
      <CardKanaInput kana="A" translation="A" />
    </MainLayout>
  );
};

export default PracticeKanaPage;
