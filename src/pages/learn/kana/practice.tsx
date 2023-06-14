import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CardKanaInput } from "~/components/cardKanaInput/cardKanaInput";
import { MainLayout } from "~/layout/main-layout";
import Custom404Page from "~/pages/404";
import { api } from "~/utils/api";

const paramSchema = z.object({
  kanaTypes: z.array(z.string()).min(1),
});

const PracticeKanaPage: NextPage = () => {
  const { query } = useRouter();

  const result = paramSchema.safeParse(query);

  const { mutate, data } = api.kanaSolutions.hello.useMutation();

  const [currentKana, setKana] = useState<{ id: string, original: string }>();

  useEffect(() => {
    mutate({
      kanaId: "",
      proposal: "",
      isInitialRequest: true,
    });

    if (!data) {
      return;
    }

    setKana({
      id: data.nextKana.id,
      original: data.nextKana.original,
    });
  }, []);

  if (!true) {
    return <Custom404Page />;
  }

  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz (active) • Kana</title>
      </Head>

      <CardKanaInput
        kana={data?.nextKana.original}
        translation="A"
        onSubmit={(value) => {
          mutate({
            proposal: value,
            isInitialRequest: false,
            kanaId: data?.nextKana.id
          });
        }}
      />
    </MainLayout>
  );
};

export default PracticeKanaPage;
