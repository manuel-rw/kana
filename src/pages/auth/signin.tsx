import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import {
  Button,
  Divider,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { MainLayout } from "~/layout/main-layout";
import { FormWrapper } from "~/components/auth/FormWrapper";
import Link from "next/link";
import { IconBrandDiscord } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { signInSchema } from "~/schemas/sign-in-schema";
import Head from "next/head";

const providerIcons = [
  {
    id: "discord",
    icon: IconBrandDiscord,
  },
];

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <Head>
        <title>Sign in</title>
      </Head>
      <FormWrapper>
        <Title order={2} align="center" mb="lg">
          Sign in
        </Title>
        <Text color="dimmed" align="center" size="sm" mb="md">
          We'll never ask for your credentials via Email. Keep your login data
          stored securely.
        </Text>
        <Stack mb="md">
          {Object.values(providers)
            .filter((x) =>
              providerIcons.flatMap((icon) => icon.id).includes(x.id)
            )
            .map((provider) => {
              const icon = providerIcons.find(
                (item) => item.id === provider.id
              );
              const ButtonIcon = icon ? <icon.icon size="1rem" /> : <></>;
              return (
                <div key={provider.name}>
                  <Button
                    leftIcon={ButtonIcon}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    w="100%"
                  >
                    Sign in with {provider.name}
                  </Button>
                </div>
              );
            })}
        </Stack>

        <Divider label="Or" labelPosition="center" mb="xl" />

        <CredentialsSignInForm />

        <Button
          component={Link}
          href="/auth/signup"
          variant="subtle"
          w="100%"
          mt="md"
        >
          Don't have an account yet?
        </Button>
      </FormWrapper>
    </MainLayout>
  );
}

const CredentialsSignInForm = () => {
  const form = useForm({
    initialValues: {
      name: undefined,
      password: undefined,
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: zodResolver(signInSchema),
  });

  const handleSubmit = () => {
    signIn("credentials", {
      redirect: true,
      name: form.values.name,
      password: form.values.password,
      callbackUrl: '/profile'
    }).catch((err) => {});
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          w="100%"
          label="Username"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <PasswordInput
          w="100%"
          label="Password"
          withAsterisk
          {...form.getInputProps("password")}
        />

        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
};

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
