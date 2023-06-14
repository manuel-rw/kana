import { Card, Checkbox, Loader, Stack, Title, Text, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { z } from "zod";
import { MainLayout } from "~/layout/main-layout";
import { api } from "~/utils/api";

const KanaPage: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = api.kana.getAll.useQuery();

  const form = useForm({
    initialValues: {
      typeKeys: data?.map((item) => item.id) ?? [],
    },
    validate: zodResolver(z.object({ typeKeys: z.array(z.string()).min(1) }))
  });


  if (isLoading || !data) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  const handleSubmit = () => {
    const params = new URLSearchParams();
    const keys= form.values.typeKeys.join(',');
    params.set('kanaTypes', keys);
    router.push('/learn/kana/practice?' + params.toString());
  }

  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz • Kana</title>
      </Head>
      <Title>Practice Hiragana</Title>

      <Card>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="xs" mb="md">
            <Text>Selected lessions</Text>
            {data.map((type, index) => (
              <Checkbox onChange={(value) => {
                const checked = value.target.checked;
                let temp = form.values.typeKeys;
                if (checked) {
                  if (!temp.includes(type.id)) {
                    temp.push(type.id);
                  }
                } else {
                  temp = temp.filter(x => x !== type.id);
                }
                form.setFieldValue('typeKeys', temp)
              }} label={type.name} key={index} />
            ))}
          </Stack>

          <Button type="submit">Start practice</Button>
        </form>
      </Card>
    </MainLayout>
  );
};

export default KanaPage;
