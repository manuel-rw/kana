import {
  Button,
  Card,
  Center,
  Container,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextPage } from "next";
import { MainLayout } from "~/layout/main-layout";
import { userRegisterFormSchema } from "~/schemas/user-schema";
import { api } from "~/utils/api";

const Register: NextPage = () => {
  const form = useForm({
    initialValues: {
      username: undefined,
      password: undefined,
    },
    validate: zodResolver(userRegisterFormSchema),
  });

  const { mutate } = api.register.register.useMutation();

  const handleSubmit = () => {
    mutate(form.values);
  };

  return (
    <>
      <MainLayout>
        <Center h="100%" w="100%">
          <Container maw="100%" w={400}>
            <Card p="xl">
              <Title align="center" mb="lg">
                Register an Account
              </Title>

              <form onSubmit={form.onSubmit(handleSubmit)}>
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
                  <Button type="submit">Register</Button>
                </Stack>
              </form>
            </Card>
          </Container>
        </Center>
      </MainLayout>
    </>
  );
};

export default Register;
