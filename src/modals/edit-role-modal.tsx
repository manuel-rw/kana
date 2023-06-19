import { Button, Switch, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ContextModalProps } from "@mantine/modals";
import { z } from "zod";
import { type findAllRolesOutputSingleItemSchema } from "~/server/api/routers/roles";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  isAdmin: z.boolean(),
});

type SingleUserType = z.infer<typeof findAllRolesOutputSingleItemSchema>;

export const EditRoleModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ role: SingleUserType }>) => {
  const utils = api.useContext();
  const { mutateAsync, isLoading } = api.roles.upsertRole.useMutation({
    onSuccess: () => {
      void utils.roles.findAllRoles.invalidate();
    },
  });

  const form = useForm({
    initialValues: {
      name: innerProps.role.name,
      isAdmin: innerProps.role.isAdmin,
    },
    validate: zodResolver(formSchema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    const data = formSchema.safeParse(form.values);

    if (!data.success) {
      return;
    }

    mutateAsync({
      id: innerProps.role.id,
      name: data.data.name,
      isAdmin: data.data.isAdmin,
    })
      .then(() => {
        context.closeModal(id);
        void utils.user.findAllUsers.invalidate();
      })
      .catch(() => {});
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        disabled={isLoading}
        label="Name"
        variant="filled"
        mb="md"
        withAsterisk
        {...form.getInputProps("name")}
      />

      <Switch
        disabled={isLoading}
        label="Is admin"
        variant="filled"
        mb="md"
        {...form.getInputProps("isAdmin", { type: "checkbox" })}
      />

      <Button
        disabled={!form.isValid()}
        loading={isLoading}
        type="submit"
        fullWidth
      >
        Save
      </Button>
    </form>
  );
};
