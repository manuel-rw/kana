import { Center, Loader } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { z } from "zod";
import { CardKanaInput } from "~/components/kana-card/cardKanaInput";
import { CommonKanaCard } from "~/components/kana-card/common";
import { MainLayout } from "~/layout/main-layout";
import Custom404Page from "~/pages/404";
import { api } from "~/utils/api";

const paramSchema = z.object({
  kanaTypes: z.array(z.string()).min(1),
});

const PracticeKanaPage: NextPage = () => {
  const { query } = useRouter();

  const result = paramSchema.safeParse(query);

  const { mutateAsync, mutate, data, isLoading } = api.kanaSolutions.hello.useMutation();

  useEffect(() => {
    mutate({
      kanaId: "",
      proposal: "",
      isInitialRequest: true,
    });
  }, []);

  if (!true) {
    return <Custom404Page />;
  }

  if (!data) {
    return (
      <MainLayout>
        <Head>
          <title>Kana Quiz (active) • Kana</title>
        </Head>

        <Center h="100%">
          <CommonKanaCard>
            <Center h="100%">
              <Loader />
            </Center>
          </CommonKanaCard>
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz (active) • Kana</title>
      </Head>

      <Center h="100%">
        <CardKanaInput
          kana={data.nextKana.original}
          isLoading={isLoading}
          onSubmit={async (value) => {
            await mutateAsync({
              proposal: value,
              isInitialRequest: false,
              kanaId: data.nextKana.id,
            });
          }}
        />
      </Center>
    </MainLayout>
  );
};

export default PracticeKanaPage;
