import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { Button, Stack, Title } from "@mantine/core";
import { MainLayout } from "~/layout/main-layout";
import { FormWrapper } from "~/components/auth/FormWrapper";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <FormWrapper>
        <Title order={2} align="center" mb="lg">
          Sign in
        </Title>
        <Stack>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button onClick={() => signIn(provider.id)} w="100%">
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
        </Stack>
      </FormWrapper>
    </MainLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
