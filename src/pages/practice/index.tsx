import {
  Card,
  Grid,
  Title,
  Text,
  Button,
  Image,
  Indicator,
  Flex,
} from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
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
    title: "Kana",
    description: "Practice your Hiragana and Katakana",
    footer: <Button fullWidth>Start practice</Button>,
    isRecommended: true,
    imageSrc:
      "https://files.tofugu.com/articles/japanese/2014-06-30-learn-hiragana/header-2560x.jpg",
  },
  {
    title: "Basic Sentences",
    description:
      "Practice your basic communication skills while translating common sentences, answering to questions and communicating with friends",
    footer: <Button fullWidth disabled>Coming soon</Button>,
    isRecommended: false,
  },
];

const PracticePage: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Practice</title>
      </Head>

      <Title mb="lg">Practice</Title>

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

export default PracticePage;
