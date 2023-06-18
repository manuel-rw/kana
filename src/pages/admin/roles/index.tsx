import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import Link from "next/link";
import { type z } from "zod";
import { NavbarMinimal } from "~/layout/admin-navbar";
import { MainLayout } from "~/layout/main-layout";
import {
  type findAllRolesOutputSchema,
  type findAllRolesOutputSingleItemSchema,
} from "~/server/api/routers/roles";
import { api } from "~/utils/api";

type UserItemsType = z.infer<typeof findAllRolesOutputSchema>;
type SingleUserItemType = z.infer<typeof findAllRolesOutputSingleItemSchema>;

const ManageUsersPage: NextPage = () => {
  const { data, isLoading } = api.roles.findAllRoles.useQuery();

  if (isLoading || !data) {
    return (
      <MainLayout navar={<NavbarMinimal />}>
        <Center h="100%">
          <Loader />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout navar={<NavbarMinimal />}>
      <Space h="xl" />

      <Breadcrumbs mb="md">
        <Anchor component={Link} href="/">
          Home
        </Anchor>
        <Anchor component={Link} href="/admin">
          Admin
        </Anchor>
        <Text color="dimmed">Roles</Text>
      </Breadcrumbs>
      <Title mb="md">Manage roles</Title>

      <Card withBorder>
        <UsersTable data={data} />
      </Card>
    </MainLayout>
  );
};

export function UsersTable({ data }: { data: UserItemsType }) {
  const context = api.useContext();
  const { mutateAsync } = api.roles.deleteRole.useMutation({
    onSuccess: () => {
      void context.roles.findAllRoles.invalidate();
    },
  });

  const openModal = (roleId: string) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">Are you sure, that you want to delete this role?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => {
        void mutateAsync({
          id: roleId,
        });
      },
    });

  const openEditModal = (role: SingleUserItemType) =>
    modals.openContextModal({
      modal: "editRoleModal",
      title: "Edit role",
      innerProps: {
        role: role,
      },
    });

  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Text fz="sm" fw={500}>
          {item.name}
        </Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon onClick={() => openEditModal(item)}>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon onClick={() => openModal(item.id)} color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table withBorder withColumnBorders verticalSpacing="sm" mb="md">
        <thead>
          <tr>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {rows.length === 0 && (
            <tr>
              <td colSpan={2}>
                <Text color="dimmed" align="center">
                  There are no roles yet
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Button
        onClick={() =>
          openEditModal({
            id: '',
            name: '',
            isAdmin: false,
          })
        }
      >
        Create role
      </Button>
    </ScrollArea>
  );
}

export default ManageUsersPage;
