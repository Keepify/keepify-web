import Button from 'components/Button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
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
              <Link href="/login">
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                  Login
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="max-w-screen-lg mx-auto flex justify-between items-center pt-24">
          <div className="max-w-1/2">
            <h1 className="text-white font-bold text-5xl pb-5 leading-tight">
              Keep Your Items
              <br />
              As Long As You Need
            </h1>
            <h2 className="text-orange-light text-lg pb-12">
              We help you find a place to store your personal shipping items within the shortest
              time and distance possible
            </h2>
            <Link href="/dropzones">
              <a>
                <Button>Explore nearby spots</Button>
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
