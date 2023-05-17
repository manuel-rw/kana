import {
  Button,
  Card,
  Container,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextPage } from "next";
import { z } from "zod";
import { MainLayout } from "~/layout/main-layout";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

const Register: NextPage = () => {
  const form = useForm({
    initialValues: {
      username: undefined,
      password: undefined,
    },
    validate: zodResolver(schema),
  });

const handleSubmit = () =>  {

}

  return (
    <>
      <MainLayout>
        <Container maw={600}>
          <Card>
            <Title align="center" mb="lg">
              Register an account
            </Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label="Username"
                  {...form.getInputProps("username")}
                />
                <PasswordInput
                  label="Password"
                  {...form.getInputProps("password")}
                />
                <Button type="submit">Register</Button>
              </Stack>
            </form>
          </Card>
        </Container>
      </MainLayout>
    </>
  );
};

export default Register;
