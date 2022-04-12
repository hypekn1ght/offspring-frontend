import React from 'react';
import { createStyles, Card, Image, Text, Group, RingProgress } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    width: 340, margin: 'auto',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface CardWithStatsProps {
  image: string;
  title: string;
  description: string;
  stats: {
    title: string;
    value: string;
  }[];
}

export function CardWithStats({ image, title, description, stats }: CardWithStatsProps) {
  const { classes } = useStyles();

  // const items = stats.map((stat) => (
  //   <div key={stat.title}>
  //     <Text size="xs" color="dimmed">
  //       {stat.title}
  //     </Text>
  //     <Text weight={500} size="sm">
  //       {stat.value}
  //     </Text>
  //   </div>
  // ));

  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section>
        <div dangerouslySetInnerHTML={{ __html: image }}/>
      </Card.Section>

      <Group position="apart" mt="xl">
        <Text size="sm" weight={700} className={classes.title}>
          {title}
        </Text>
        <Group spacing={5}>
          <Text size="sm" color="dimmed">
            #{description}
          </Text>
        </Group>
      </Group>
    </Card>
  );
}