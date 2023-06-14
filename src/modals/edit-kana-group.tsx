import { Button, Group, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ContextModalProps } from "@mantine/modals";
import { type KanaGroup } from "@prisma/client";
import { z } from "zod";
import { api } from "~/utils/api";

export const EditKanaGroupModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ group: KanaGroup }>) => {
  const utils = api.useContext();
  const { mutateAsync } = api.kana.upsertKanaGroup.useMutation();
  const { mutateAsync: mutateDeleteKanaAsync } =
    api.kana.deleteKanaGroup.useMutation();
  const form = useForm({
    initialValues: {
      name: innerProps.group.name
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1).max(999),
      })
    ),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    mutateAsync({
      id: innerProps.group.id,
      name: form.values.name,
      typeId: innerProps.group.typeId,
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
        mb="xl"
        withAsterisk
        {...form.getInputProps("name")}
      />
      <Group grow>
        {innerProps.group.id.length > 0 && (
          <Button
            onClick={() => {
              mutateDeleteKanaAsync({
                groupId: innerProps.group.id,
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
        )}

        <Button disabled={!form.isValid()} type="submit">
          Save
        </Button>
      </Group>
    </form>
  );
};
