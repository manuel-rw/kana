import {
  Anchor,
  Breadcrumbs,
  SimpleGrid,
  Space,
  Text,
  Title,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { IconLanguageHiragana } from "@tabler/icons-react";
import { type NextPage } from "next";
import { getSession, type GetSessionParams } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { MainLayout } from "~/layout/main-layout";

const data = [
  {
    title: "Hiragana & Katakana",
    icon: IconLanguageHiragana,
    color: "violet",
    href: "/learn/kana",
  },
];

const PracticePage: NextPage = () => {
  const { classes, theme } = useStyles();

  const items = data.map((item) => {
    const color = theme.colors[item.color];

    if (!color) {
      return;
    }

    return (
      <UnstyledButton
        key={item.title}
        component={Link}
        href={item.href}
        className={classes.item}
      >
        <item.icon color={color[6]} size="2rem" />
        <Text size="xs" mt={7}>
          {item.title}
        </Text>
      </UnstyledButton>
    );
  });
  return (
    <MainLayout>
      <Head>
        <title>Learn • Profile</title>
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

      <Title mb="lg">What do you want to practice?</Title>

      <SimpleGrid cols={3} mt="md">
        {items}
      </SimpleGrid>
    </MainLayout>
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

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  title: {
    fontWeight: 700,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    height: rem(90),
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.05)",
    },
  },
}));

export default PracticePage;
