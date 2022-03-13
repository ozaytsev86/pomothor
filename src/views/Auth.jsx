import React from 'react';
import {locale} from '../locale/EnUs';
import {Alert, Button, Heading, Pane, Text, TextInputField} from 'evergreen-ui';
import {supabase} from '../services/api';
import {BORDER_RADIUS_XL, UNIT_2, UNIT_3, UNIT_4} from '../configs/StyleVariables';

export const Auth = () => {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [form, setForm] = React.useState({email: '', password: ''});

  const handleOAuthLogin = async (provider) => {
    // You need to enable the third party auth you want in Authentication > Settings
    // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
    let {error} = await supabase.auth.signIn({provider});
    if (error) {
      console.log('Error: ', error.message);
    }
  };

  const handleLogin = async (type) => {
    const {email, password} = form;

    const {user, error} =
      type === 'LOGIN'
        ? await supabase.auth.signIn({email, password})
        : await supabase.auth.signUp({email, password});

    if (error) {
      setError(error.message);
    } else if (user && !error) {
      setError(null);
      setSuccess('An email has been sent to you for verification!');
    }
  };

  const forgotPassword = async (e) => {
    // Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
    e.preventDefault();
    const email = prompt('Please enter your email:');

    if (email === null || email === '') {
      setError('You must enter your email.');
    } else {
      let {error} = await supabase.auth.api.resetPasswordForEmail(
        email
      );
      if (error) {
        console.error('Error: ', error.message);
      } else {
        setError('Password recovery email has been sent.');
      }
    }
  };

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      className="e-bg e-bg-image-login"
    >
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        borderRadius={BORDER_RADIUS_XL}
        padding={UNIT_4}
        width={300}
        backgroundColor="white"
        className="u-box-shadow-1"
      >
        <Heading size={900} paddingBottom={UNIT_4}>{locale.Login}</Heading>
        <TextInputField
          required
          type="email"
          marginBottom={UNIT_2}
          label="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <TextInputField
          required
          type="password"
          marginBottom={0}
          label="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <Pane display="flex" justifyContent="flex-end" marginBottom={UNIT_3}>
          <Button appearance="minimal" onClick={forgotPassword}>Forgot Password?</Button>
        </Pane>
        {success && (
          <Alert intent="success" marginBottom={UNIT_3}>
            {success}
          </Alert>
        )}{error && (
        <Alert intent="danger" marginBottom={UNIT_3}>
          {error}
        </Alert>
      )}
        <Pane display="flex" justifyContent="space-between" marginBottom={UNIT_3}>
          <Button width="48%" type="submit" onClick={() => handleLogin('REGISTER')}>Sign Up</Button>
          <Button width="48%" type="submit" appearance="primary" onClick={() => handleLogin('LOGIN')}>Sign In</Button>
        </Pane>

        <Text color="muted" textAlign="center" padding={UNIT_3}>Or continue with</Text>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Button width="60%" appearance="primary" margin={UNIT_2} onClick={() => handleOAuthLogin('github')}>
            GitHub
          </Button>
          <Button width="60%" appearance="primary" margin={UNIT_2} onClick={() => handleOAuthLogin('google')}>
            Google
          </Button>
        </Pane>
      </Pane>
      <Heading size={100} position="absolute" bottom={0}>
        Photo by <a href="https://www.pexels.com/@fauxels" target="_blank" rel="noopener noreferrer">fauxels</a>
      </Heading>
    </Pane>
  );
};
