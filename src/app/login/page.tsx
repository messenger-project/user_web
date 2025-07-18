'use client'

import React, {useState} from "react";
import RequestService from "@/services/RequestService";
import AuthForm from "@/app/components/forms/auth/AuthForm";
import Link from "next/link";
import Cookies from "universal-cookie";


const Login = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: {email: string, password: string}) => {
        const cookies = new Cookies(null, { path: '/' });

        setIsSubmitting(true);
        const requestService = new RequestService('/auth/login');
        const result = await requestService.post(data);
        cookies.set('token', result.access_token, {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
            sameSite: 'lax',            // حتما تنظیم کنید
            secure: process.env.NODE_ENV === 'production',  // اگر لوکالید secure رو false بذارید
        });

        setIsSubmitting(false);
    }

    return (
        <div className="container flex justify-center mx-auto h-screen items-center">
            <AuthForm id='login' onSubmit={onSubmit} isSubmitting={isSubmitting} formTitle='Login Form' buttonTitle='Login' />
            <Link href='/register'>Register</Link>
        </div>
    );
}

export default Login;