import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import {
  type ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";
import { useColorScheme } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { EditKanaModal } from "~/modals/edit-kana-modal";
import { EditKanaGroupType } from "~/modals/edit-kana-group-type";
import { EditKanaGroupModal } from "~/modals/edit-kana-group";
import { RouterTransition } from "~/components/router-transition";
import { EditUserModal } from "~/modals/edit-user-modal";
import { EditRoleModal } from "~/modals/edit-role-modal";

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
