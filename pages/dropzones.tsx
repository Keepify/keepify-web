import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import Input from 'components/Input';
import { Search } from 'react-feather';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import googleMapsTheme from 'public/googleMapsTheme.json';

export default function Dropzones() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const { query } = useRouter();
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    // @ts-ignore
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    console.log({ map });
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!query.lat || !query.lng) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log({ position });
      });
    }
  }, []);

  return (
    <div className="w-full">
      <nav className="w-full bg-purple shadow-xl relative">
        <div className="px-7 h-20 mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-orange-light text-xl tracking-widest font-bold">Keepify</a>
          </Link>
          <ul className="flex flex-row">
            <li>
              <Link href="/about">
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  Become a Host
                </a>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  Login
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex dropzone-container">
        <div className="w-3/5 overflow-y-auto bg-full-white py-12 px-7">
          <div className="pb-12">
            <Input
              placeholder="Search any location"
              prefixElement={
                <span>
                  <Search size={16} color="#7E7E7E" />
                </span>
              }
            />
          </div>
          <h2 className="text-black font-bold text-2xl pb-4">Nearby Storages</h2>
          <div className="container mx-auto">
            <div className="flex flex-wrap -mx-1 lg:-mx-4">
              <Dummy />
              <Dummy />
              <Dummy />
              <Dummy />
              <Dummy />
              <Dummy />
            </div>
          </div>
        </div>
        <div className="w-2/5 mr-auto">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                height: '100%',
                width: '100%',
              }}
              center={{ lat: Number(query.lat), lng: Number(query.lng) }}
              zoom={14}
              options={{
                styles: googleMapsTheme,
                disableDefaultUI: true,
              }}
              onLoad={onLoad}
              onUnmount={onUnmount}
            ></GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}

const Dummy = () => (
  <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
    <article className="overflow-hidden rounded-lg shadow-lg">
      <a href="#">
        <img
          alt="Placeholder"
          className="block h-auto w-full"
          src="https://picsum.photos/600/400/?random"
        />
      </a>
      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
        <h1 className="text-lg">
          <a className="no-underline hover:underline text-black" href="#">
            Article Title
          </a>
        </h1>
        <p className="text-grey-darker text-sm">14/4/19</p>
      </header>
      <footer className="flex items-center justify-between leading-none p-2 md:p-4">
        <a className="flex items-center no-underline hover:underline text-black" href="#">
          <img
            alt="Placeholder"
            className="block rounded-full"
            src="https://picsum.photos/32/32/?random"
          />
          <p className="ml-2 text-sm">Author Name</p>
        </a>
      </footer>
    </article>
  </div>
);
