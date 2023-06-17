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
  Alert,
} from "@mantine/core";
import { MainLayout } from "~/layout/main-layout";
import { FormWrapper } from "~/components/auth/FormWrapper";
import Link from "next/link";
import { IconAlertTriangle, IconBrandDiscord } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { signInSchema } from "~/schemas/sign-in-schema";
import Head from "next/head";
import { useRouter } from "next/router";

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
        <title>Sign in • Profile</title>
      </Head>
      <FormWrapper>
        <Title order={2} align="center" mb="lg">
          Sign in
        </Title>
        <Text align="center" size="sm" mb="md">
          We&apos;ll never ask for your credentials via Email. Keep your login data
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
                      void signIn(provider.id);
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
          Don&apos;t have an account yet?
        </Button>
      </FormWrapper>
    </MainLayout>
  );
}

const ErrorDisplay = ({ error }: { error: string }) => {
  switch (error) {
    case "CredentialsSignin":
      return (
        <Alert icon={<IconAlertTriangle size="1rem" />} color="red">
          Your credentials are incorrect or this account doesn&apos;t exist. Please
          try again
        </Alert>
      );
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return (
        <Alert icon={<IconAlertTriangle size="1rem" />} color="red">
          Unable to sign you in with this account. Please try again later
        </Alert>
      );
    case "Default":
      return (
        <Alert icon={<IconAlertTriangle size="1rem" />} color="red">
          An unexpected error occurred during the log in. Please try again
        </Alert>
      );
  }

  return null;
};

const CredentialsSignInForm = () => {
  const { query } = useRouter();

  const signInError = query.error as string;

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
      callbackUrl: "/profile",
    }).catch(() => {});
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          w="100%"
          label="Username"
          placeholder="Your username"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <PasswordInput
          w="100%"
          label="Password"
          placeholder="Your password"
          withAsterisk
          {...form.getInputProps("password")}
        />

        {signInError && <ErrorDisplay error={signInError} />}

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
