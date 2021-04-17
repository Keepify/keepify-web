import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import Input from 'components/Input';
import { Mail, Lock } from 'react-feather';
import Button from 'components/Button';
import { useRouter } from 'next/router';
import { useFormError } from 'hooks/validation';
import Loader from 'components/Loader';
import { emailPattern } from 'helpers/validation';
import { useState } from 'react';
import { errorNotification } from 'helpers/notification';
import { useDispatch } from 'react-redux';
import { loginUser } from 'services/user';
import { setUserInfo } from 'actions/user';
import { NextPage } from 'next';
import { PageContext } from 'types';
import { redirect } from 'middlewares/redirect';

type Inputs = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const Router = useRouter();
  const { register, handleSubmit, errors } = useForm<Inputs>();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useFormError(errors);

  async function onSubmit(data: Inputs) {
    try {
      setIsLoading(true);

      const user = await loginUser(data.email, data.password);

      dispatch(setUserInfo(user));

      setIsLoading(false);

      const { r } = Router.query;

      // if any redirection link exist, redirect to the specified page instead
      Router.push(r ? decodeURIComponent(r as string) : '/profile');
    } catch (e) {
      if (e?.response?.data?.message) {
        errorNotification('Error', e.response.data.message);
      } else {
        errorNotification('Error', 'An unexpected error has occurred. Please try again later.');
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-between">
      {isLoading && <Loader />}
      <div className="w-1/2 min-h-screen relative lg:block hidden">
        <Image className="object-cover" src="/sign/sign.png" layout="fill" alt="bg" />
      </div>
      <div className="lg:w-1/2 w-full bg-purple overflow-auto min-h-screen py-20 lg:px-24 px-10">
        <Link href="/">
          <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
        </Link>

        <h1 className="text-white font-bold lg:text-5xl text-4xl pt-14 pb-5 leading-tight">
          Login
        </h1>
        <span className="text-grey text-sm">
          Don’t have an account yet?{' '}
          <Link href="/signup">
            <a>
              <u>Sign up here</u>
            </a>
          </Link>
        </span>

        <form className="pt-12" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="pb-4">
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
              })}
            />
          </div>

          <div className="text-right pb-12">
            <Link href="/forgot-password">
              <a className="text-sm text-white">Forgot Password</a>
            </Link>
          </div>

          <div>
            <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.getInitialProps = async (ctx: PageContext) => {
  const { store } = ctx;

  if (store.getState().user.isLogin) {
    redirect(ctx.res, '/');
  }
};

export default Login;
