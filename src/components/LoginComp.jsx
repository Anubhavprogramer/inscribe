import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function LoginComp() {
  return (
    <>
        <SignIn
        path="/"
        routing="path"
        />
    </>
  )
}

export default LoginComp