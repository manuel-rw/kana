import {
  AppShell,
  Avatar,
  Burger,
  Center,
  Container,
  Drawer,
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
  IconLogin,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DarkModeToggle } from "./dark-mode-toggle";
import { useDisclosure } from "@mantine/hooks";

interface MainLayoutProps {
  children: ReactNode;
}

const links: {
  label: string;
  link: string;
  links?: { link: string; label: string }[];
}[] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Practice",
    link: "/learn",
    links: [
      {
        label: "Hiragana & Katakana",
        link: "/learn/kana",
      },
    ],
  },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { classes } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <Text component={Link} href={item.link}>{item.label}</Text>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Link href={link.link} className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={rem(12)} stroke={1.5} />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

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
                <Burger
                  opened={opened}
                  onClick={toggle}
                  className={classes.burger}
                  size="sm"
                  color="white"
                />
                <UnstyledButton component={Link} href="/" mr="xl">
                  <Group h="100%" align="center" spacing="xs">
                    <IconLanguageHiragana color="white" />

                    <Text size="xl" weight="bold" color="white">
                      Kana
                    </Text>
                  </Group>
                </UnstyledButton>

                <Group className={classes.links}>{items}</Group>
              </Group>

              <Drawer opened={opened} onClose={close}>
                {items}
              </Drawer>

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
            paddingTop: 55,
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
      <UnstyledButton
        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        component={Link}
        href="/auth/signin"
      >
        <Group spacing={7}>
          <Text
            weight={500}
            size="sm"
            sx={{ lineHeight: 1, color: theme.white }}
            mr={3}
          >
            Sign In
          </Text>
          <IconLogin size={rem(12)} stroke={1.5} />
        </Group>
      </UnstyledButton>
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

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.gray[3],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.grape[8]
          : theme.colors.grape[7],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));
