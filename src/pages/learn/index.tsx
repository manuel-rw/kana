import {
  Button,
  Card,
  Flex,
  Grid,
  Image,
  Indicator,
  Text,
  Title,
} from "@mantine/core";
import { type NextPage } from "next";
import { type GetSessionParams, getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";
import { MainLayout } from "~/layout/main-layout";

interface PracticeCard {
  imageSrc?: string;
  title: string;
  description: string;
  isRecommended: boolean;
  footer: ReactNode;
}

const cards: PracticeCard[] = [
  {
    title: "Practice reading Kana",
    description:
      "In this course, you'll practice reading Hiragana and Katakana, the most basic writing in Japanese. Being able to read Hiragana and Katakana will enable you, to read and write basic sentences in Japanese.",
    footer: (
      <Button component={Link} href="/learn/kana/" fullWidth>
        Start practice
      </Button>
    ),
    isRecommended: true,
    imageSrc:
      "https://files.tofugu.com/articles/japanese/2014-06-30-learn-hiragana/header-2560x.jpg",
  },
  {
    title: "Basic Sentences",
    description:
      "Practice your basic communication skills while translating common sentences, answering to questions and communicating with friends",
    footer: (
      <Button fullWidth disabled>
        Coming soon
      </Button>
    ),
    isRecommended: false,
  },
];

const PracticePage: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Learn • Profile</title>
      </Head>

      <Title mb="lg">What&apos;s up on your mind today?</Title>

      <Grid justify="stretch">
        {cards.map((card, index) => (
          <Grid.Col xs={12} sm={6} md={4} key={index}>
            <Indicator
              styles={{
                common: { height: "auto", marginRight: 35 },
                root: { height: "100%" },
              }}
              label="Recommended"
              position="top-end"
              disabled={!card.isRecommended}
            >
              <Card
                shadow="md"
                h="inherit"
                withBorder
                display="flex"
                style={{ flexDirection: "column" }}
              >
                {card.imageSrc && (
                  <Card.Section mb="md">
                    <Image src={card.imageSrc} w="100%" h="100%" alt="" />
                  </Card.Section>
                )}
                <Flex direction="column" h="inherit">
                  <Title order={5}>{card.title}</Title>
                  <Text mb="md" style={{ flexGrow: 1 }}>
                    {card.description}
                  </Text>
                  {card.footer}
                </Flex>
              </Card>
            </Indicator>
          </Grid.Col>
        ))}
      </Grid>
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

export default PracticePage;
