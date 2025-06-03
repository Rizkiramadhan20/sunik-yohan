import React from 'react'

import { Metadata } from 'next'

import { redirect } from 'next/navigation'

import SigninLayout from "@/hooks/auth/signin/SigninLayout"

import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Sign In | Sunik Yohan',
    description: 'Sign in to your account',
}

export default async function Signin() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    return (
        <SigninLayout />
    )
}
