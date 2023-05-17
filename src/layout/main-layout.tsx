import Link from "next/link";
import {
  AppShell,
  Avatar,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { ReactNode } from "react";
import { IconLanguageHiragana, IconLogout, IconUser } from "@tabler/icons-react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
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
              <Menu width={150} withArrow withinPortal>
                <Menu.Target>
                  <Avatar />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<IconUser size="1rem" />}>
                    Your Profile
                  </Menu.Item>
                  <Menu.Item icon={<IconLogout size="1rem" />} color="red">
                    Sign Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
  );
};
