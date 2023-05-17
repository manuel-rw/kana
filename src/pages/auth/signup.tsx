import {
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
  List,
  Checkbox,
  Anchor,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormWrapper } from "~/components/auth/FormWrapper";
import { MainLayout } from "~/layout/main-layout";
import { signUpFormSchema } from "~/schemas/sign-up-schema";
import { api } from "~/utils/api";

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

  const { mutate } = api.register.register.useMutation();

  const handleSubmit = (values) => {
    mutate({
      username: values.username,
      password: values.password,
    });
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
              <Button type="submit">Register</Button>
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
