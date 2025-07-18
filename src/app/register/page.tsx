'use client'

import React, { useState } from "react";
import AuthForm from "@/app/components/forms/auth/AuthForm";
import RequestService from "@/services/RequestService";
import Link from "next/link";

const Register = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: {email: string, password: string}) => {
        setIsSubmitting(true);
        const requestService = new RequestService('/auth/register');
        await requestService.post(data);
        setIsSubmitting(false);
    }

    return (
        <div className="container flex justify-center mx-auto h-screen items-center bg-gray-300">
            <div className='container mx-auto p-4 rounded-lg w-6/12 bg-white text-black'>
                <AuthForm id='register' onSubmit={onSubmit} isSubmitting={isSubmitting} formTitle='Register Form' buttonTitle='Register' />
                <Link href='/login' className='border rounded-xl p-2 hover:bg'>Login</Link>
            </div>
        </div>
    );
}

export default Register;