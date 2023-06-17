import { ActionIcon, useMantineColorScheme, 
    createStyles } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export const DarkModeToggle = () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const {classes} = useStyles();

    return (
        <ActionIcon
            onClick={() => toggleColorScheme()}
            size="xl"
            sx={(theme) => ({
                backgroundColor: "#0000001c",
                '&:hover': {
                    backgroundColor: "#00000038",
                },
                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
            })}
            radius="xl"
            className={classes.main}
        >
            {colorScheme === 'dark' ? (
                <IconSun className={classes.icon} />
            ) : (
                <IconMoonStars className={classes.icon}  />
            )}
        </ActionIcon>
    );
}


const useStyles = createStyles(({}) => ({
    main: {
      ':hover': { backgroundColor: 'transparent'}
    },
    icon: {
      color: 'white'
    }
  }));
