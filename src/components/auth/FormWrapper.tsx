import { Card, Center, Container } from "@mantine/core";
import { ReactNode } from "react";

interface FormWrapperProps {
  children: ReactNode;
}

export const FormWrapper = ({ children }: FormWrapperProps) => {
  return (
    <Center h="100%" w="100%">
      <Container maw="100%" w={400}>
        <Card p="xl">{children}</Card>
      </Container>
    </Center>
  );
};
