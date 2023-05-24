import { Card, TextInput, Text, Button, Stack } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';

interface CardKanaInputProps {
    kana: string;
    translation: string;
}

//TODO: API CALL FOR CHECK VALID INPUT
//TODO: REMOVE form for VALIDATE

export const CardKanaInput = ({ kana, translation }: CardKanaInputProps) => {
    const form = useForm({
        initialValues: {
          inputValue: '',
        },
    
        validate: {
            inputValue: (value) => (value !== translation),
        },
      });

  return (
    <Card w='30%' padding="lg" radius="md">
        <form onSubmit={form.onSubmit((values) => form.isValid()?console.log(values):console.log('fuck'))}>
            <Stack align='center'>
                <Text size={128}>{kana}</Text>

                <TextInput size='xl' w='90%' placeholder="Translation" {...form.getInputProps('inputValue')}/>

                <Button type="submit" size='lg' w='90%' variant="light" color="blue" fullWidth mt="md" radius="md">
                    Validate
                </Button>
            </Stack>
        </form>
    </Card>
  );
};