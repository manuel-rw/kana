import { Space } from "@mantine/core";
import { type NextPage } from "next";
import { getSession, useSession, type GetSessionParams } from "next-auth/react";
import Head from "next/head";
import { UserCardImage } from "~/components/profile/profile-card";
import { MainLayout } from "~/layout/main-layout";

const ProfilePage: NextPage = () => {
  const { data } = useSession();

  if (!data || !data.user || !data.user.name) {
    return null;
  }

  return (
    <MainLayout>
      <Head>
        <title>{data.user.name} • Profile</title>
      </Head>

      <Space h="xl" />

      <UserCardImage
        avatar={data.user.image}
        image={data.user.image}
        name={data.user.name}
      />
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
