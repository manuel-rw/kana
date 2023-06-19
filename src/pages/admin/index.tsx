import { Anchor, Breadcrumbs, Space, Title, Text } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { NavbarMinimal } from "~/layout/admin-navbar";
import { MainLayout } from "~/layout/main-layout";

const AdminDashboard = () => {
  return (
    <MainLayout navar={<NavbarMinimal />}>
      <Head>
        <title>Admin Dashboard • Kana</title>
      </Head>

      <Space h="xl" />

      <Breadcrumbs mb="md">
        <Anchor component={Link} href="/">
          Home
        </Anchor>
        <Text color="dimmed">Admin</Text>
      </Breadcrumbs>

      <Title mb="md">Admin Dashboard</Title>
    </MainLayout>
  );
};

export default AdminDashboard;
