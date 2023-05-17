import Link from "next/link";
import { AppShell, Group, Header, Text, UnstyledButton } from "@mantine/core";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AppShell
      header={
        <Header height={50}>
          <Group position="apart" h="100%" px="md">
            <Group h="100%" align="center">
              <UnstyledButton component={Link} href="/">
                <Text size="xl" weight="bold">
                  Kana
                </Text>
              </UnstyledButton>
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
