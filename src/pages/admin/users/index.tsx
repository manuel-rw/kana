import {
  ActionIcon,
  Anchor,
  Avatar,
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
import { MainLayout } from "~/layout/main-layout";
import { type findAllUsersOutputSchema } from "~/server/api/routers/users";
import { api } from "~/utils/api";

type Type = z.infer<typeof findAllUsersOutputSchema>;

const ManageUsersPage: NextPage = () => {
  const { data, isLoading } = api.user.findAllUsers.useQuery();

  if (isLoading || !data) {
    return (
      <MainLayout>
        <Center h="100%">
          <Loader />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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

export function UsersTable({ data }: { data: Type }) {
  const context = api.useContext();
  const { mutateAsync } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      void context.user.findAllUsers.invalidate();
    }
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

      <td>{item.roles.join("")}</td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
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
