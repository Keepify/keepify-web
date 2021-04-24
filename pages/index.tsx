import Button from 'components/Button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import { useEffect, useMemo, useState } from 'react';
import { LatLng, PageContext } from 'types';
import { useUserInfo } from 'hooks/redux';
import { NextPage } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import cookies from 'js-cookie';
import { Menu } from 'react-feather';
import Drawer from 'components/Drawer';
import Head from 'next/head';

const Home: NextPage = () => {
  const [position, setPosition] = useState<LatLng>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogin } = useUserInfo();
  const Router = useRouter();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    });
  }, []);

  useEffect(() => {
    if (Router.query.logout) {
      delete axios.defaults.headers.common['Authorization'];
      cookies.remove('_ap.ut');
      Router.push('/');
    }
  }, []);

  const positionQuery = useMemo(() => {
    if (position) {
      return `?lat=${position.latitude}&lng=${position.longitude}`;
    }
    return '';
  }, [position]);

  return (
    <article className="bg-purple min-h-screen">
      <Head>
        <title>Keepify | Keep Your Items As Long As You Need</title>
      </Head>
      <Drawer show={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <li className="pb-4">
          <Link href={`/dropzones${positionQuery}`}>
            <a className="text-white text-xl tracking-wider">Dropzones</a>
          </Link>
        </li>
        <li className="pb-4">
          <Link href={isLogin ? '/profile' : '/login'}>
            <a className="text-white text-xl tracking-wider">{isLogin ? 'Profile' : 'Login'}</a>
          </Link>
        </li>
      </Drawer>
      <section className="w-full pt-20 pb-32">
        <nav className="lg:max-w-screen-lg lg:w-full w-10/12 mx-auto flex lg:flex-row flex-col-reverse justify-between items-center">
          <Link href="/">
            <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
          </Link>
          <ul className="lg:flex flex-row hidden">
            <li>
              <Link href={`/dropzones${positionQuery}`}>
                <a className="text-white text-xl tracking-wider">Dropzones</a>
              </Link>
            </li>
            <li>
              <Link href={isLogin ? '/profile' : '/login'}>
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                  {isLogin ? 'Profile' : 'Login'}
                </a>
              </Link>
            </li>
          </ul>
          <div className="lg:hidden flex">
            <span className="cursor-pointer pb-6" onClick={() => setIsMenuOpen(true)}>
              <Menu size={36} color="#fff" />
            </span>
          </div>
        </nav>
        <div className="lg:max-w-screen-lg lg:w-full w-10/12 mx-auto flex justify-between items-center lg:pt-24 pt-12 lg:flex-row flex-col">
          <div className="lg:max-w-1/2 max-w-none">
            <Fade up duration={600} delay={300}>
              <h1 className="text-white font-bold lg:text-5xl text-4xl pb-5 leading-tight">
                Keep Your Items
                <br />
                As Long As You Need
              </h1>
            </Fade>
            <Fade up duration={600} delay={800}>
              <h2 className="text-orange-light text-lg pb-12">
                We help you find a place to store your personal shipping items within the shortest
                time and distance possible
              </h2>
            </Fade>
            <div className="lg:block lg:pb-0 pb-12 flex flex-col">
              <Link href={`/dropzones${positionQuery}`}>
                <a>
                  <Zoom duration={600} delay={1400}>
                    <Button className="lg:w-auto w-full">Explore nearby spots</Button>
                  </Zoom>
                </a>
              </Link>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <Image src="/home/deliveries.svg" alt="delivery" width={520} height={400} />
          </motion.div>
        </div>
      </section>
    </article>
  );
};

Home.getInitialProps = async (ctx: PageContext) => {
  const { query } = ctx;

  if (query.logout) {
    ctx.store.dispatch({ type: 'LOGOUT_USER' });
    delete axios.defaults.headers.common['Authorization'];
  }

  return {};
};

export default Home;
