import {
  AppShell,
  Avatar,
  Button,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
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

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        header={
          <Header height={50}>
            <Group position="apart" h="100%" px="md">
              <UnstyledButton component={Link} href="/">
                <Group h="100%" align="center" spacing="xs">
                  <IconLanguageHiragana />

                  <Text size="xl" weight="bold">
                    Kana
                  </Text>
                </Group>
              </UnstyledButton>

              <Group>
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
        {children}
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
        <Avatar />
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
          onClick={async () => {
            await signOut();
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
