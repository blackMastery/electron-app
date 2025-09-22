import React from 'react';
import { Button, Callout, Card, Flex, Heading, IconButton, Link as RadixLink, Separator, Strong, Switch, Text, TextField } from '@radix-ui/themes';
import { EyeClosedIcon, EyeOpenIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function App() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100dvh' }} px="5">
      <Card size="3" style={{ width: '100%', maxWidth: 440 }}>
        <Flex direction="column" gap="4">
          <Heading size="6" align="center">Sign in</Heading>

          {errorMessage && (
            <Callout.Root color="red" role="alert">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{errorMessage}</Callout.Text>
            </Callout.Root>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget as HTMLFormElement);
              const email = String(formData.get('email') || '').trim();
              const password = String(formData.get('password') || '');

              if (!email || !password) {
                setErrorMessage('Please enter your email and password.');
                return;
              }

              setErrorMessage('');
              // TODO: hook into Electron IPC or API auth
              console.log({ email, password });
            }}
          >
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1">Email</Text>
                <TextField.Root name="email" type="email" placeholder="you@example.com" size="3" required />
              </label>

              <label>
                <Text as="div" size="2" mb="1">Password</Text>
                <TextField.Root name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" size="3" required>
                  <TextField.Slot side="right">
                    <IconButton size="2" variant="ghost" type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </label>

              <Flex align="center" justify="between">
                <Flex asChild align="center" gap="2">
                  <label>
                    <Switch name="remember" />
                    <Text size="2">Remember me</Text>
                  </label>
                </Flex>
                <RadixLink href="#" size="2">Forgot password?</RadixLink>
              </Flex>

              <Button type="submit" size="3" highContrast>Sign in</Button>
            </Flex>
          </form>

          <Separator my="1" size="4" />

          <Text size="2" align="center">
            Don&apos;t have an account? <RadixLink href="#"><Strong>Sign up</Strong></RadixLink>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}


