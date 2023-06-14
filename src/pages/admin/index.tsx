import { Title } from "@mantine/core";
import Head from "next/head";
import { MainLayout } from "~/layout/main-layout";

const AdminDashboard = () => {
  return (
    <MainLayout>
      <Head>
        <title>Admin Dashboard • Kana</title>
      </Head>
      <Title>Admin Dashboard</Title>
    </MainLayout>
  );
};

export default AdminDashboard;