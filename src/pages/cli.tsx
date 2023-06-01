import { Card, LoadingOverlay, Stack, Group, Select, TextInput, Button, Switch, Alert, Code, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconSend, IconAlertTriangle } from "@tabler/icons-react";
import { type NextPage } from "next";
import { MainLayout } from "~/layout/main-layout";
import { commandSchema } from "~/schemas/command-schema";
import { api } from "~/utils/api";

const CliPage: NextPage = () => {
  return <MainLayout>
    <CommandForm />
  </MainLayout>
}

const CommandForm = () => {
  const { mutate, isError, error, data, isLoading } =
    api.command.ipConfig.useMutation();
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      command: undefined,
      parameters: undefined,
      useSanetization: false,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(commandSchema),
  });

  const handleSubmit = () => {
    open();
    const data = commandSchema.parse(form.values);
    mutate({
      command: data.command,
      parameters: data.parameters,
      useSanetization: data.useSanetization,
    });
    close();
  };

  const commandValues = commandSchema._def.shape().command._def.values;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card pos="relative">
        <LoadingOverlay visible={visible || isLoading} overlayBlur={2} />
        <Stack mb="md">
          <Group>
            <Select
              data={commandValues}
              label="Command"
              placeholder="Root control command"
              withinPortal
              withAsterisk
              {...form.getInputProps("command")}
            />
            <TextInput
              style={{ flexGrow: 1, alignSelf: 'start' }}
              label="Parameters"
              placeholder="Custom parameters, eg. /all, -L, or & hostname"
              {...form.getInputProps("parameters")}
            />
            <Button
              leftIcon={<IconSend size="1rem" />}
              loading={visible}
              style={{ alignSelf: "start" }}
              type="submit"
              variant="default"
              mt="xl"
            >
              Submit
            </Button>
          </Group>
          <Switch
            label="Sanetize"
            description="Split the control channel from the data channel"
            {...form.getInputProps("useSanetization", { type: "checkbox" })}
          />
        </Stack>

        {isError && error && (
          <Alert icon={<IconAlertTriangle size="1rem" />} color="red" mb="md">
            <Text color="red">{error.message.length > 0 ? error.message : 'Unknown Error'}</Text>
          </Alert>
        )}
        {data && (
          <Code block mb="md" w="100%">
            {data}
          </Code>
        )}
      </Card>
    </form>
  );
};


export default CliPage;