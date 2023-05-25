import { Title } from "@mantine/core";
import { type NextPage } from "next";
import { MainLayout } from "~/layout/main-layout";

const KanaPage: NextPage = () => {
  return (
    <MainLayout>
      <Title>Practice Hiragana</Title>
    </MainLayout>
  );
};

export default KanaPage;