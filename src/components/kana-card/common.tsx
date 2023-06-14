import { Card } from "@mantine/core";
import { type ReactNode } from "react";

export const CommonKanaCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card w={300} h={400} withBorder>
      {children}
    </Card>
  );
};
