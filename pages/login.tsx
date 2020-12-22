import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import Input from 'components/Input';
import { Mail, Lock } from 'react-feather';
import Button from 'components/Button';

export default function Login() {
  return (
    <div className="flex justify-between">
      <div className="w-1/2 min-h-screen relative">
        <Image className="object-cover" src="/sign/sign.png" layout="fill" alt="bg" />
      </div>
      <div className="w-1/2 bg-purple overflow-auto min-h-screen py-20 px-24">
        <Link href="/">
          <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
        </Link>

        <h1 className="text-white font-bold text-5xl pt-14 pb-5 leading-tight">Login</h1>
        <span className="text-grey text-sm">
          Don’t have an account yet?{' '}
          <Link href="/signup">
            <a>
              <u>Sign up here</u>
            </a>
          </Link>
        </span>

        <form className="pt-12">
          <div className="pb-6">
            <label className="text-white text-sm">Email</label>
            <Input
              containerClassName="bg-white mt-2 rounded-md"
              className="py-4 bg-white"
              prefixElement={
                <span>
                  <Mail size={16} color="#7E7E7E" />
                </span>
              }
              placeholder="example@gmail.com"
            />
          </div>
          <div className="pb-4">
            <label className="text-white text-sm">Password</label>
            <Input
              type="password"
              containerClassName="bg-white mt-2 rounded-md"
              className="py-4 bg-white"
              prefixElement={
                <span>
                  <Lock size={16} color="#7E7E7E" />
                </span>
              }
              placeholder="••••••••••••"
            />
          </div>

          <div className="text-right pb-12">
            <Link href="/forgot-password">
              <a className="text-sm text-white">Forgot Password</a>
            </Link>
          </div>

          <div>
            <Button className="w-full">Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
