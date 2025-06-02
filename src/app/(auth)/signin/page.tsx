import React from 'react'

import { Metadata } from 'next'

import SigninLayout from "@/hooks/auth/signin/SigninLayout"

export const metadata: Metadata = {
    title: 'Sign In | Sunik Yohan',
    description: 'Sign in to your account',
}

export default function Signin() {
    return (
        <SigninLayout />
    )
}
