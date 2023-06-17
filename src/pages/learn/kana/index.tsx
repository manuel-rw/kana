import {
  Accordion,
  Alert,
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Flex,
  Loader,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { type Kana, type KanaGroup, type KanaGroupType } from "@prisma/client";
import { IconAlertTriangle } from "@tabler/icons-react";
import { type NextPage } from "next";
import { getSession, type GetSessionParams } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { MainLayout } from "~/layout/main-layout";
import { api } from "~/utils/api";

const KanaPage: NextPage = () => {
  const { data, isLoading } = api.kana.getAll.useQuery();

  if (isLoading || !data) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Kana Quiz • Kana</title>
      </Head>

      <Space h="xl" />

      <Breadcrumbs mb="md">
        <Anchor component={Link} href="/">
          Home
        </Anchor>
        <Anchor component={Link} href="/learn">
          Practice
        </Anchor>
        <Text color="dimmed">Select Kana</Text>
      </Breadcrumbs>

      <Title mb="xs">Practice Hiragana</Title>
      <Text mb="md">
        Choose, which Hiragana or Katakana you would like to learn. After
        you&apos;ve selected the desired characters, press the button below to
        start learning.
      </Text>

      <Card withBorder>
        <KanaSelectionForm data={data} />
      </Card>
    </MainLayout>
  );
};

const KanaSelectionForm = ({
  data,
}: {
  data: (KanaGroupType & {
    groups: (KanaGroup & {
      kanas: Kana[];
    })[];
  })[];
}) => {
  const router = useRouter();
  const enrichedData = data.map((item) => ({
    ...item,
    groups: item.groups.map((group) => ({
      ...group,
      checked: false,
    })),
  }));

  const form = useForm({
    initialValues: {
      groups: enrichedData,
    },
  });

  const checkedGroups = form.values.groups.flatMap((group) =>
    group.groups.filter((g) => g.checked).flatMap((g) => g.id)
  );

  const handleSubmit = () => {
    const params = new URLSearchParams();
    const keys = checkedGroups.join(",");
    params.set("kanaTypes", keys);
    void router.push("/learn/kana/practice?" + params.toString());
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Text weight="bold" mb="md">
        Practice configuration
      </Text>
      <Accordion variant="separated">
        {form.values.groups.map((item, index) => (
          <Accordion.Item key={index} value={`item-${index}`}>
            <Flex>
              <Checkbox
                label={item.name}
                checked={item.groups.every((x) => x.checked)}
                indeterminate={
                  item.groups.filter((x) => x.checked).length > 0 &&
                  item.groups.some((x) => !x.checked)
                }
                onChange={(event) => {
                  const checked = event.target.checked;
                  item.groups.forEach((_, index3) => {
                    form.setFieldValue(
                      `groups.${index}.groups.${index3}.checked`,
                      checked
                    );
                  });
                }}
                style={{
                  whiteSpace: 'nowrap'
                }}
                p="md"
              />
              <Accordion.Control />
            </Flex>
            <Accordion.Panel>
              <Stack>
                {item.groups.map((group, index2) => (
                  <Checkbox
                    label={`${group.name} (${group.kanas.length})`}
                    key={index2}
                    checked={group.checked}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      form.setFieldValue(
                        `groups.${index}.groups.${index2}.checked`,
                        checked
                      );
                    }}
                    ml="lg"
                  />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      {checkedGroups.length === 0 && (
        <Alert icon={<IconAlertTriangle size="1rem" />} color="red" mt="md">
          Please select at least one group of Kana to continue
        </Alert>
      )}

      <Button
        type="submit"
        disabled={checkedGroups.length === 0}
        mt="md"
        fullWidth
      >
        Start
      </Button>
    </form>
  );
};

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default KanaPage;
