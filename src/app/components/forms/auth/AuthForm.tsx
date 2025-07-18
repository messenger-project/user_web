'use client'

import React from "react";
import { z } from 'zod';
import InputField from "@/app/components/core/InputField/InputField";
import Button from "@/app/components/core/Button/Button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(16, { message: 'Password must not exceed 16 characters' })
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
    id: string;
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting?: boolean;
    formTitle: string;
    buttonTitle: string
}

const AuthForm: React.FC<AuthFormProps> = ({
    id,
    onSubmit,
    isSubmitting = false,
    formTitle,
    buttonTitle
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="container mx-auto p-4 rounded-lg w-2/4 bg-white text-black">
            <h2>{formTitle}</h2>
            <InputField label='Email:' error={errors.email?.message} {...register('email')} />
            <InputField label='Password:' type='password' error={errors.password?.message} {...register('password')} />
            <Button className='my-2'>{isSubmitting ? 'Sending....' : buttonTitle}</Button>
        </form>
    );
}

export default AuthForm;