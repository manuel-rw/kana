import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
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
  type findAllUsersOutputSchema,
  type findAllUsersOutputSingleItemSchema,
} from "~/server/api/routers/users";
import { api } from "~/utils/api";

type UserItemsType = z.infer<typeof findAllUsersOutputSchema>;
type SingleUserItemType = z.infer<typeof findAllUsersOutputSingleItemSchema>;

const ManageUsersPage: NextPage = () => {
  const { data, isLoading } = api.user.findAllUsers.useQuery();

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
        <Text color="dimmed">Users</Text>
      </Breadcrumbs>
      <Title mb="md">Manage users</Title>

      <Card withBorder>
        <UsersTable data={data} />
      </Card>
    </MainLayout>
  );
};

export function UsersTable({ data }: { data: UserItemsType }) {
  const context = api.useContext();
  const { mutateAsync } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      void context.user.findAllUsers.invalidate();
    },
  });

  const openModal = (userId: string) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">Are you sure, that you want to delete this user?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => {
        void mutateAsync({
          id: userId,
        });
      },
    });

  const openEditModal = (user: SingleUserItemType) =>
    modals.openContextModal({
      modal: "editUserModal",
      title: "test",
      innerProps: {
        user: user,
      },
    });

  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={item.image} radius={30} />
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </td>

      <td>
        <Group spacing="xs">
          {item.roles.map((role, index) => (
            <Badge key={index} color={role.isAdmin ? 'red' : 'green'}>{role.name}</Badge>
          ))}
        </Group>
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
      <Table withBorder withColumnBorders verticalSpacing="sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default ManageUsersPage;
