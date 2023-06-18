import { Button, MultiSelect, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ContextModalProps } from "@mantine/modals";
import { z } from "zod";
import { type findAllUsersOutputSingleItemSchema } from "~/server/api/routers/users";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().nullable(),
  roles: z.array(z.string()),
});

type SingleUserType = z.infer<typeof findAllUsersOutputSingleItemSchema>;

export const EditUserModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ user: SingleUserType }>) => {
  const utils = api.useContext();
  const { mutateAsync, isLoading } = api.user.updateUser.useMutation();
  const { data: rolesData } = api.roles.findAllRoles.useQuery();

  const form = useForm({
    initialValues: {
      name: innerProps.user.name,
      email: innerProps.user.email,
      roles: innerProps.user.roles.map((role) => role.id),
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
      id: innerProps.user.id,
      name: data.data.name,
      email: data.data.email,
      roles: data.data.roles,
    })
      .then(() => {
        context.closeModal(id);
        void utils.user.findAllUsers.invalidate();
      })
      .catch(() => {});
  };

  const data =
    rolesData?.map((role) => ({ value: role.id, label: role.name })) ?? [];

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
      <TextInput
        disabled={isLoading}
        label="Email"
        variant="filled"
        mb="md"
        {...form.getInputProps("email")}
      />

      <MultiSelect
        disabled={isLoading}
        data={data}
        variant="filled"
        label="Roles"
        mb="xl"
        {...form.getInputProps("roles")}
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
