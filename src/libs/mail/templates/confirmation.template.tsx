import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps): React.ReactElement {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Подтверждение почты</Heading>
          <Text>Привет! Для подтверждения почты нажмите на ссылку:</Text>
          <Link href={confirmLink}>Подтвердить почту </Link>
          <Text>
            Эта ссылка действительна в течение 1 часа. Если вы не создавали
            аккаунт, просто проигнорируйте это сообщение.
          </Text>
          <Text>С уважением, команда проекта.</Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
