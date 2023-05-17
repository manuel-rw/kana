import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAlertTriangle } from "@tabler/icons-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { FormWrapper } from "~/components/auth/FormWrapper";
import { MainLayout } from "~/layout/main-layout";
import { signUpFormSchema } from "~/schemas/sign-up-schema";
import { api } from "~/utils/api";

type FormType = z.infer<typeof signUpFormSchema>;

const Register: NextPage = () => {
  const form = useForm({
    initialValues: {
      username: undefined,
      password: undefined,
      acceptTos: false,
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: zodResolver(signUpFormSchema),
  });

  const { mutate, isError, error, isLoading } =
    api.register.register.useMutation();

  const handleSubmit = (values: FormType) => {
    mutate(values);
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <MainLayout>
        <FormWrapper>
          <Title order={2} align="center" mb="lg">
            Register an Account
          </Title>

          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack>
              <TextInput
                label="Username"
                withAsterisk
                {...form.getInputProps("username")}
              />
              <PasswordInput
                label="Password"
                withAsterisk
                {...form.getInputProps("password")}
              />
              <Checkbox
                label={
                  <Text>
                    I accept the
                    <Anchor href="https://mantine.dev" target="_blank" mx={3}>
                      terms and conditions
                    </Anchor>
                  </Text>
                }
                {...form.getInputProps("acceptTos")}
              />
              <Button type="submit" loading={isLoading}>
                Register
              </Button>

              {isError && (
                <Alert color="red" icon={<IconAlertTriangle size="1rem" />}>
                  <Text color="red">{error.message}</Text>
                </Alert>
              )}
            </Stack>
          </form>

          <Button
            component={Link}
            href="/auth/signin"
            variant="subtle"
            w="100%"
            mt="md"
          >
            Already have an account?
          </Button>
        </FormWrapper>
      </MainLayout>
    </>
  );
};

export default Register;
