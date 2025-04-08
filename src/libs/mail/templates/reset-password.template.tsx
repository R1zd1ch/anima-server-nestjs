import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps): React.ReactElement {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Сброс пароля</Heading>
          <Text>Привет! Вы запросили сброс пароля.</Text>
          <Link href={resetLink}>Сбросить пароль</Link>
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
