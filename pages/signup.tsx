import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import Input from 'components/Input';
import { Mail, Lock, User } from 'react-feather';
import Button from 'components/Button';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFormError } from 'hooks/validation';
import { errorNotification } from 'helpers/notification';
import { emailPattern, passwordPattern } from 'helpers/validation';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function Signup() {
  const Router = useRouter();
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);

  useFormError(errors);

  async function onSubmit(data: Inputs) {
    console.log({ data });
    try {
      setIsLoading(true);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorNotification('Error', e);
    }
  }
  return (
    <div className="flex justify-between">
      <div className="w-1/2 min-h-screen relative">
        <Image className="object-cover" src="/sign/sign.png" layout="fill" alt="bg" />
      </div>
      <div className="w-1/2 bg-purple overflow-auto min-h-screen py-20 px-24">
        <Link href="/">
          <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
        </Link>

        <h1 className="text-white font-bold text-5xl pt-14 pb-5 leading-tight">
          Create New Account
        </h1>
        <span className="text-grey text-sm">
          Already have an account?{' '}
          <Link href="/login">
            <a>
              <u>Login here</u>
            </a>
          </Link>
        </span>

        <form className="pt-12" onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-6 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="text-white text-sm">First Name</label>
              <Input
                name="firstName"
                containerClassName="bg-white mt-2 rounded-md"
                className="py-4 bg-white"
                prefixElement={
                  <span>
                    <User size={16} color="#7E7E7E" />
                  </span>
                }
                placeholder="Your first name"
                ref={register({
                  required: 'Please provide your first name!',
                })}
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="text-white text-sm">Last Name</label>
              <Input
                name="lastName"
                containerClassName="bg-white mt-2 rounded-md"
                className="py-4 bg-white"
                prefixElement={
                  <span>
                    <User size={16} color="#7E7E7E" />
                  </span>
                }
                placeholder="Your last name"
                ref={register({
                  required: 'Please provide your last name!',
                })}
              />
            </div>
          </div>
          <div className="pb-6">
            <label className="text-white text-sm">Email</label>
            <Input
              name="email"
              type="email"
              containerClassName="bg-white mt-2 rounded-md"
              className="py-4 bg-white"
              prefixElement={
                <span>
                  <Mail size={16} color="#7E7E7E" />
                </span>
              }
              placeholder="example@gmail.com"
              ref={register({
                required: 'Please provide your email address!',
                pattern: {
                  value: emailPattern,
                  message: 'Incorrect email format!',
                },
              })}
            />
          </div>
          <div className="pb-12">
            <label className="text-white text-sm">Password</label>
            <Input
              name="password"
              type="password"
              containerClassName="bg-white mt-2 rounded-md"
              className="py-4 bg-white"
              prefixElement={
                <span>
                  <Lock size={16} color="#7E7E7E" />
                </span>
              }
              placeholder="••••••••••••"
              ref={register({
                required: 'Please provide your password!',
                pattern: {
                  value: passwordPattern,
                  message:
                    'Your password must contain at least 8 characters, one digit, one lower case and one upper case',
                },
              })}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}