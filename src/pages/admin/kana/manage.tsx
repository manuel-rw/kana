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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/layout/main-layout";
import { api } from "~/utils/api";

const ManageKanaPage: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Manage Kana • Kana</title>
      </Head>
      <Title mb="lg">Manage Kana</Title>

      <KanaGroupTypesTables />

      <Space h="md" />

      <AddNewKanaGroupTypeForm />
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
                    <UnstyledButton onClick={() => {
                      modals.openContextModal({
                        modal: 'editKanaGroupModal',
                        title: 'Edit Kana Group',
                        innerProps: {
                          group: group,
                        }
                      });
                    }}>
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
  });
  const { mutate } = api.kana.upsertKanaGroupType.useMutation({
    onSuccess: () => {
      void context.kana.getAll.invalidate();
    }
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
        <Group>
          <TextInput
            variant="filled"
            placeholder="Hiragana, Katakana, ..."
            style={{ flexGrow: 1 }}
            {...form.getInputProps("name")}
          />
          <Button type="submit">Add Type</Button>
        </Group>
      </Card>
    </form>
  );
};

export default ManageKanaPage;
