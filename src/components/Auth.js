import React from 'react';
import {locale} from '../locale/EnUs';
import {Alert, Button, Heading, Pane, Text, TextInputField} from 'evergreen-ui';
import {supabase} from '../services/api';

export const Auth = () => {
  const [helperText, setHelperText] = React.useState({error: null, text: null});
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleOAuthLogin = async (provider) => {
    // You need to enable the third party auth you want in Authentication > Settings
    // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
    let {error} = await supabase.auth.signIn({provider});
    if (error) {
      console.log('Error: ', error.message);
    }
  };

  const handleLogin = async (type) => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const {user, error} =
      type === 'LOGIN'
        ? await supabase.auth.signIn({email, password})
        : await supabase.auth.signUp({email, password});

    if (error) {
      setHelperText({error: true, text: error.message});
    } else if (user && !error) {
      setHelperText({
        error: false,
        text: 'An email has been sent to you for verification!'
      });
    }
  };

  const forgotPassword = async (e) => {
    // Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
    e.preventDefault();
    const email = prompt('Please enter your email:');

    if (email === null || email === '') {
      setHelperText({error: true, text: 'You must enter your email.'});
    } else {
      let {error} = await supabase.auth.api.resetPasswordForEmail(
        email
      );
      if (error) {
        console.error('Error: ', error.message);
      } else {
        setHelperText({
          error: false,
          text: 'Password recovery email has been sent.'
        });
      }
    }
  };

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        background="blue25"
        borderRadius={10}
        padding={32}
        width={300}
      >
        <Heading size={900} paddingBottom={32}>{locale.Login}</Heading>

        <TextInputField
          required
          type="email"
          marginBottom={8}
          ref={emailRef}
          label="Email"
        />
        <TextInputField
          required
          type="password"
          marginBottom={0}
          ref={passwordRef}
          label="Password"
        />
        <Pane display="flex" justifyContent="flex-end" marginBottom={8}>
          <Button appearance="minimal" onClick={forgotPassword}>Forgot Password?</Button>
        </Pane>
        {!!helperText.text && !helperText.error && (
          <Alert intent="success" marginBottom={16}>
            {helperText.text}
          </Alert>
        )}
        {helperText.error && (
          <Alert intent="danger" marginBottom={16}>
            {helperText.text}
          </Alert>
        )}
        <Pane display="flex" width="100%" justifyContent="space-between" marginBottom={16}>
          <Button width="48%" type="submit" onClick={() => handleLogin('REGISTER')}>Sign Up</Button>
          <Button width="48%" type="submit" appearance="primary" onClick={() => handleLogin('LOGIN')}>Sign In</Button>
        </Pane>

        <Text color="muted" textAlign="center" padding={16}>Or continue with</Text>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Button
            width="60%"
            appearance="primary"
            margin={8}
            onClick={() => handleOAuthLogin('github')}
          >
            GitHub
          </Button>
          <Button
            width="60%"
            appearance="primary"
            margin={8}
            onClick={() => handleOAuthLogin('google')}
          >
            Google
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};
