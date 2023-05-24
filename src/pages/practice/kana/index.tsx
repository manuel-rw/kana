import { type NextPage } from "next";
import { CardKanaInput } from "~/components/cardKanaInput/cardKanaInput";
import { MainLayout } from "~/layout/main-layout";

const KanaPage: NextPage = () => {
  return (
    <MainLayout>
      <CardKanaInput kana="A" translation="A" />
    </MainLayout>
  );
};

export default KanaPage;
