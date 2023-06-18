import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import {
  ColorSchemeProvider,
  MantineProvider,
  type ColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useState } from "react";
import { RouterTransition } from "~/components/router-transition";
import { EditKanaGroupModal } from "~/modals/edit-kana-group";
import { EditKanaGroupType } from "~/modals/edit-kana-group-type";
import { EditKanaModal } from "~/modals/edit-kana-modal";
import { EditRoleModal } from "~/modals/edit-role-modal";
import { EditUserModal } from "~/modals/edit-user-modal";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <SessionProvider session={session}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            colorScheme,
            colors: {
              brand: [
                "#F8F0FC",
                "#F3D9FA",
                "#EEBEFA",
                "#E599F7",
                "#DA77F2",
                "#CC5DE8",
                "#BE4BDB",
                "#AE3EC9",
                "#9C36B5",
                "#862E9C",
              ],
            },
            primaryColor: "brand",
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <RouterTransition />
          <Notifications />
          <ModalsProvider
            modals={{
              editKanaModal: EditKanaModal,
              editKanaGroupModal: EditKanaGroupModal,
              editKanaGroupType: EditKanaGroupType,
              editUserModal: EditUserModal,
              editRoleModal: EditRoleModal,
            }}
          >
            <Component {...pageProps} />
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
