import {
  Button,
  Card,
  Table,
  TextInput,
  Title,
  Text,
  ActionIcon,
  Menu,
  UnstyledButton,
  Group,
  Space,
  Stack,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconDots,
  IconLanguageKatakana,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { NavbarMinimal } from "~/layout/admin-navbar";
import { MainLayout } from "~/layout/main-layout";
import { api } from "~/utils/api";

const ManageKanaPage: NextPage = () => {
  return (
    <MainLayout navar={<NavbarMinimal />}>
      <Head>
        <title>Manage Kana • Kana</title>
      </Head>

      <Space h="xl" />

      <Breadcrumbs mb="md">
        <Anchor component={Link} href="/">
          Home
        </Anchor>
        <Anchor component={Link} href="/admin">
          Admin
        </Anchor>
        <Text color="dimmed">Manage Kana</Text>
      </Breadcrumbs>
      <Title mb="md">Manage Kana</Title>

      <Card withBorder>
        <KanaGroupTypesTables />

        <Space h="md" />

        <AddNewKanaGroupTypeForm />
      </Card>
    </MainLayout>
  );
};

const KanaGroupTypesTables = () => {
  const utils = api.useContext();
  const { data, isLoading } = api.kana.getAll.useQuery();
  const { mutate: mutateKanaDeletion } = api.kana.deleteKanaGroup.useMutation({
    onSuccess: () => {
      void utils.kana.getAll.invalidate();
    },
  });

  if (isLoading || !data) {
    return <>loading...</>;
  }

  if (data.length === 0) {
    return (
      <Stack align="center" spacing="xs">
        <IconLanguageKatakana />
        <Title align="center" order={4}>
          There are no Kana saved yet
        </Title>
      </Stack>
    );
  }

  return (
    <Stack spacing="md">
      {data.map((type, index) => {
        const maxLength = Math.max(
          ...type.groups.map((group) => group.kanas.length)
        );
        return (
          <Table
            key={index}
            withBorder
            withColumnBorders
            highlightOnHover
            striped
          >
            <thead>
              <tr>
                <th colSpan={type.groups.length + 2}>
                  <Group position="center">
                    <Text align="center" weight="bold">
                      {type.name}
                    </Text>
                    <ActionIcon
                      onClick={() => {
                        modals.openContextModal({
                          modal: "editKanaGroupType",
                          title: "Edit Type",
                          innerProps: {
                            type: type,
                          },
                        });
                      }}
                      variant="default"
                    >
                      <IconPencil size="1rem" />
                    </ActionIcon>
                  </Group>
                </th>
              </tr>
              <tr>
                {type.groups.map((group, typeIndex) => (
                  <th key={typeIndex}>
                    <UnstyledButton
                      onClick={() => {
                        modals.openContextModal({
                          modal: "editKanaGroupModal",
                          title: "Edit Kana Group",
                          innerProps: {
                            group: group,
                          },
                        });
                      }}
                    >
                      <Text>{group.name}</Text>
                    </UnstyledButton>
                  </th>
                ))}
                <th style={{ width: "100%" }}></th>
                <th>
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      modals.openContextModal({
                        modal: "editKanaGroupModal",
                        title: "Add Kana Group",
                        innerProps: {
                          group: {
                            typeId: type.id,
                            name: "",
                            id: "",
                          },
                        },
                      });
                    }}
                  >
                    <IconPlus size="1rem" />
                  </ActionIcon>
                </th>
              </tr>
            </thead>

            <tbody>
              {maxLength > 0 &&
                Array.from(Array(maxLength).keys()).map((_, y) => (
                  <tr key={y}>
                    {Array.from(Array(type.groups.length).keys()).map(
                      (_, x) => {
                        const kana = type.groups[x]?.kanas[y];
                        return (
                          <td key={x}>
                            <UnstyledButton
                              onClick={() => {
                                modals.openContextModal({
                                  modal: "editKanaModal",
                                  title: "Test modal from context",
                                  innerProps: {
                                    kana: kana,
                                  },
                                });
                              }}
                              w="100%"
                              h="100%"
                            >
                              <Text align="center">{kana?.kana}</Text>
                            </UnstyledButton>
                          </td>
                        );
                      }
                    )}
                    <td colSpan={2}></td>
                  </tr>
                ))}
              {type.groups.length === 0 && (
                <Stack align="center" py="md" spacing={4}>
                  <IconSearch opacity={0.5} />
                  <Text color="dimmed">No groups available</Text>
                  <Text color="dimmed" size="sm">
                    Use the button at the top right to add new groups
                  </Text>
                </Stack>
              )}
            </tbody>

            <tfoot>
              {type.groups.map((group, groupIndex) => (
                <td key={groupIndex}>
                  <Menu withArrow withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="default" my="xs" mx="auto">
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconPlus size="1rem" />}
                        onClick={() => {
                          modals.openContextModal({
                            modal: "editKanaModal",
                            title: "Test modal from context",
                            innerProps: {
                              kana: {
                                kana: "",
                                romanji: "",
                                id: "",
                                groupId: group.id,
                              },
                            },
                          });
                        }}
                      >
                        Add kana
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          mutateKanaDeletion({
                            groupId: group.id,
                          });
                        }}
                        icon={<IconTrash size="1rem" />}
                        color="red"
                      >
                        Delete group
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              ))}
              <th style={{ width: "100%" }} colSpan={2}></th>
            </tfoot>
          </Table>
        );
      })}
    </Stack>
  );
};

const AddNewKanaGroupTypeForm = () => {
  const context = api.useContext();
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: zodResolver(z.object({ name: z.string().min(1).max(999) })),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  const { mutate } = api.kana.upsertKanaGroupType.useMutation({
    onSuccess: () => {
      void context.kana.getAll.invalidate();
    },
  });

  const handleSubmit = () => {
    mutate({
      id: "",
      name: form.values.name,
    });

    form.reset();
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card>
        <Group align="start">
          <TextInput
            variant="filled"
            placeholder="Hiragana, Katakana, ..."
            style={{ flexGrow: 1 }}
            {...form.getInputProps("name")}
          />
          <Button type="submit" disabled={!form.isValid()}>
            Add Type
          </Button>
        </Group>
      </Card>
    </form>
  );
};

export default ManageKanaPage;
