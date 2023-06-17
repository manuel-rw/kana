import {
  AppShell,
  Avatar,
  Button,
  Container,
  Group,
  Header,
  Menu,
  ScrollArea,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLanguageHiragana,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState, type ReactNode } from "react";
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
          <Header height={55} className={classes.main}>
            <Group position="apart" h="100%" pl="lg" pr="md">
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
            height: "100vh",
            paddingTop: 55
          },
        })}
      >
        <ScrollArea type="auto" h="100%">
          <Container maw={800}>{children}</Container>
        </ScrollArea>
      </AppShell>
    </>
  );
};

const Profile = () => {
  const { data: sessionData } = useSession();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
    <Menu
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      width={150}
      withArrow
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group spacing={7}>
            <Avatar
              src={sessionData.user.image}
              alt={sessionData.user.name ?? undefined}
              radius="xl"
              size={20}
            />
            <Text
              weight={500}
              size="sm"
              sx={{ lineHeight: 1, color: theme.white }}
              mr={3}
            >
              {sessionData.user.name}
            </Text>
            <IconChevronDown size={rem(12)} stroke={1.5} />
          </Group>
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

const useStyles = createStyles((theme) => ({
  navItem: {
    color: theme.colors.gray[2],
    "&:hover": { color: theme.colors.gray[0] },
  },
  main: {
    backgroundColor: theme.colors.grape[theme.colorScheme === "dark" ? 7 : 6],
  },
  btn: {
    backgroundColor: theme.colors.grape[theme.colorScheme === "dark" ? 4 : 7],
  },
  user: {
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
  },
}));
