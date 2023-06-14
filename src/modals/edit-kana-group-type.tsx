import { Button, Group, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ContextModalProps } from "@mantine/modals";
import { type KanaGroupType } from "@prisma/client";
import { z } from "zod";
import { api } from "~/utils/api";

export const EditKanaGroupType = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ type: KanaGroupType }>) => {
  const utils = api.useContext();
  const { mutateAsync } = api.kana.upsertKanaGroupType.useMutation();
  const { mutateAsync: mutateDeleteKanaAsync } =
    api.kana.deleteKanaGroupType.useMutation();
  const form = useForm({
    initialValues: {
      name: innerProps.type.name
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1).max(100),
      })
    ),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    mutateAsync({
      id: innerProps.type.id,
      name: form.values.name,
    })
      .then(() => {
        context.closeModal(id);
        void utils.kana.getAll.invalidate();
      })
      .catch(() => {});
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        variant="filled"
        mb="md"
        withAsterisk
        {...form.getInputProps("name")}
      />
      <Group grow>
        <Button
          onClick={() => {
            mutateDeleteKanaAsync({
              id: innerProps.type.id,
            })
              .then(() => {
                context.closeModal(id);
                void utils.kana.getAll.invalidate();
              })
              .catch(() => {});
          }}
          color="red"
        >
          Delete
        </Button>
        <Button disabled={!form.isValid()} type="submit">
          Save
        </Button>
      </Group>
    </form>
  );
};
