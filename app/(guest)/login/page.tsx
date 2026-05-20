import { Metadata } from 'next'
import { LoginClient } from './components/login-client'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Masuk ke akun Human Resource Management System Deltamas',
}

export default function LoginPage() {
    return <LoginClient />
}