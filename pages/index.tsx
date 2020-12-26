import Button from 'components/Button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import { useEffect, useMemo, useState } from 'react';
import { LatLng } from 'types';
import { useUserInfo } from 'hooks/redux';

export default function Home() {
  const [position, setPosition] = useState<LatLng>(null);
  const user = useUserInfo();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    });
  }, []);

  const positionQuery = useMemo(() => {
    if (position) {
      return `?lat=${position.latitude}&lng=${position.longitude}`;
    }
    return '';
  }, [position]);

  return (
    <div>
      <section className="w-full bg-purple pt-20 pb-32">
        <nav className="max-w-screen-lg mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
          </Link>
          <ul className="flex flex-row">
            <li>
              <Link href="/about">
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                  About
                </a>
              </Link>
            </li>
            <li>
              <Link href={user ? '/profile' : '/login'}>
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                  {user ? 'Profile' : 'Login'}
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="max-w-screen-lg mx-auto flex justify-between items-center pt-24">
          <div className="max-w-1/2">
            <Fade up duration={600} delay={300}>
              <h1 className="text-white font-bold text-5xl pb-5 leading-tight">
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
            <Link href={`/dropzones${positionQuery}`}>
              <a>
                <Zoom duration={600} delay={1400}>
                  <Button>Explore nearby spots</Button>
                </Zoom>
              </a>
            </Link>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <Image src="/home/deliveries.svg" alt="delivery" width={520} height={400} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
