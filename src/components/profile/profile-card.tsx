import { Avatar, Card, Image, Text, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardImageProps {
  image?: string | null;
  avatar?: string | null;
  name: string;
}

export function UserCardImage({ image, avatar, name }: UserCardImageProps) {
  const { classes } = useStyles();

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section
        sx={{
          height: 140,
          overflow: "hidden",
        }}
      >
        <Image
          src={image}
          fit="contain"
          alt=""
          styles={{
            figure: {
              position: "relative",
              "&::after": {
                content: '" "',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backdropFilter: "blur(10px)" /* apply the blur */,
                pointerEvents: "none" /* make the overlay click-through */,
              },
            },
          }}
        />
      </Card.Section>
      <Avatar
        src={avatar}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text>
    </Card>
  );
}
