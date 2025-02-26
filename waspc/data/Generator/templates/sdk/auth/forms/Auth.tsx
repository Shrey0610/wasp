{{={= =}=}}
import { useState, createContext } from 'react'
import { createTheme } from '@stitches/react'
import { styled } from 'wasp/core/stitches.config'

import {
  type State,
  type CustomizationOptions,
  type ErrorMessage,
  type AdditionalSignupFields,
} from './types'
import { LoginSignupForm } from './internal/common/LoginSignupForm'
import { MessageError, MessageSuccess } from './internal/Message'
{=# isEmailAuthEnabled =}
import { ForgotPasswordForm } from './internal/email/ForgotPasswordForm'
import { ResetPasswordForm } from './internal/email/ResetPasswordForm'
import { VerifyEmailForm } from './internal/email/VerifyEmailForm'
{=/ isEmailAuthEnabled =}

const logoStyle = {
  height: '3rem'
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const HeaderText = styled('h2', {
  fontSize: '1.875rem',
  fontWeight: '700',
  marginTop: '1.5rem'
})


// PRIVATE API
export const AuthContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
  setErrorMessage: (errorMessage: ErrorMessage | null) => {},
  setSuccessMessage: (successMessage: string | null) => {},
})

function Auth ({ state, appearance, logo, socialLayout = 'horizontal', additionalSignupFields }: {
    state: State;
} & CustomizationOptions & {
  additionalSignupFields?: AdditionalSignupFields;
}) {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO(matija): this is called on every render, is it a problem?
  // If we do it in useEffect(), then there is a glitch between the default color and the
  // user provided one.
  const customTheme = createTheme(appearance ?? {})

  const titles: Record<State, string> = {
    login: 'Log in to your account',
    signup: 'Create a new account',
    {=# isEmailAuthEnabled =}
    "forgot-password": "Forgot your password?",
    "reset-password": "Reset your password",
    "verify-email": "Email verification",
    {=/ isEmailAuthEnabled =}
  }
  const title = titles[state]

  const socialButtonsDirection = socialLayout === 'vertical' ? 'vertical' : 'horizontal'

  return (
    <Container className={customTheme}>
      <div>
        {logo && (<img style={logoStyle} src={logo} alt='Your Company' />)}
        <HeaderText>{title}</HeaderText>
      </div>

      {errorMessage && (
        <MessageError>
          {errorMessage.title}{errorMessage.description && ': '}{errorMessage.description}
        </MessageError>
      )}
      {successMessage && <MessageSuccess>{successMessage}</MessageSuccess>}
      <AuthContext.Provider value={{ isLoading, setIsLoading, setErrorMessage, setSuccessMessage }}>
        {(state === 'login' || state === 'signup') && (
          <LoginSignupForm
            state={state}
            socialButtonsDirection={socialButtonsDirection}
            additionalSignupFields={additionalSignupFields}
          />
        )}
        {=# isEmailAuthEnabled =}
        {state === 'forgot-password' && (<ForgotPasswordForm />)}
        {state === 'reset-password' && (<ResetPasswordForm />)}
        {state === 'verify-email' && (<VerifyEmailForm />)}
        {=/ isEmailAuthEnabled =}
      </AuthContext.Provider>
    </Container>
  )
}

// PRIVATE API
export default Auth;
