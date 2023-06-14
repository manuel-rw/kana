import { Button, Group, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ContextModalProps } from "@mantine/modals";
import { type Kana } from "@prisma/client";
import { z } from "zod";
import { api } from "~/utils/api";

export const EditKanaModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ kana: Kana }>) => {
  const utils = api.useContext();
  const { mutateAsync } = api.kana.upsertKana.useMutation();
  const { mutateAsync: mutateDeleteKanaAsync } =
    api.kana.deleteKana.useMutation();
  const form = useForm({
    initialValues: {
      original: innerProps.kana.kana,
      romanji: innerProps.kana.romanji,
    },
    validate: zodResolver(
      z.object({
        original: z.string().min(1).max(5),
        romanji: z.string().min(1).max(5),
      })
    ),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    mutateAsync({
      name: form.values.original,
      romanji: form.values.romanji,
      kanaId: innerProps.kana.id,
      groupId: innerProps.kana.groupId,
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
        label="Original Kana"
        variant="filled"
        mb="md"
        withAsterisk
        {...form.getInputProps("original")}
      />
      <TextInput
        label="Romaji Kana"
        variant="filled"
        mb="xl"
        withAsterisk
        {...form.getInputProps("romanji")}
      />
      <Group grow>
        {innerProps.kana.id.length > 0 && (
          <Button
            onClick={() => {
              mutateDeleteKanaAsync({
                id: innerProps.kana.id,
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
