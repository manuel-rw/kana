import { ActionIcon, useMantineColorScheme, 
    createStyles } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export const DarkModeToggle = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const {classes} = useStyles();

    return (
        <ActionIcon
            onClick={() => toggleColorScheme()}
            size="xl"
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
            })}
            bg='transparent'
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
