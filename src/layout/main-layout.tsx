import {
  AppShell,
  Avatar,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import {
  IconLanguageHiragana,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";
import { DarkModeToggle } from "./dark-mode-toggle";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { classes } = useStyles();
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        header={
          <Header height={50} className={classes.main}>
            <Group position="apart" h="100%" pl="md" pr="xs">
              <Group spacing="xl">
                <UnstyledButton component={Link} href="/" mr="xl">
                  <Group h="100%" align="center" spacing="xs">
                    <IconLanguageHiragana color="white" />

                    <Text size="xl" weight="bold" color="white">
                      Kana
                    </Text>
                  </Group>
                </UnstyledButton>

                <UnstyledButton component={Link} href="/learn">
                  <Text className={classes.navItem}>Learn</Text>
                </UnstyledButton>
              </Group>

              <Group>
                <DarkModeToggle />
                <Profile />
              </Group>
            </Group>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Container maw={800}>{children}</Container>
      </AppShell>
    </>
  );
};

const Profile = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <Button
        component={Link}
        href="/auth/signin"
        leftIcon={<IconUser size="1rem" />}
        variant="default"
      >
        Login
      </Button>
    );
  }

  return (
    <Menu width={150} withArrow withinPortal>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={sessionData.user.image} radius="xl" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUser size="1rem" />}
          component={Link}
          href="/profile"
        >
          Your Profile
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            void signOut();
          }}
          icon={<IconLogout size="1rem" />}
          color="red"
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const useStyles = createStyles(({ colors, colorScheme }) => ({
  navItem: {
    color: colors.gray[2],
    "&:hover": { color: colors.gray[0] },
  },
  main: {
    backgroundColor: colors.grape[colorScheme === "dark" ? 7 : 6],
  },
  btn: {
    backgroundColor: colors.grape[colorScheme === "dark" ? 4 : 7],
  },
}));
