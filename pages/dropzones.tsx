import ReactMapGL, { ViewportProps, FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import Input from 'components/Input';
import { Search } from 'react-feather';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LatLng } from 'types';
import { getGeocode } from 'services/map';
import { useDebouncedCallback } from 'use-debounce';
import Skeleton from 'react-loading-skeleton';

export default function Dropzones() {
  const { query } = useRouter();
  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    latitude: query.lat ? Number(query.lat) : 0,
    longitude: query.lng ? Number(query.lng) : 0,
  });
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: 40.738841,
    longitude: -74.0272836,
    zoom: 12,
  } as ViewportProps);
  const debouncedSearch = useDebouncedCallback(searchDropzone, 500);

  // Request current location through navigator
  useEffect(() => {
    if (!query.lat || !query.lng) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    setViewPort((prev) => ({
      ...prev,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    }));
  }, [currentLocation]);

  async function searchDropzone(query: string) {
    if (query.trim().length) {
      const list = await getGeocode(query);

      if (list?.features?.length) {
        // move to the center of the first result
        setViewPort((prev) => ({
          ...prev,
          zoom: 14,
          latitude: list.features[0].center[1],
          longitude: list.features[0].center[0],
        }));
      }
    }
  }

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
              onChange={(e) => {
                debouncedSearch.callback(e.target.value);
              }}
            />
          </div>
          <h2 className="text-black font-bold text-2xl pb-4">Nearby Storages</h2>
          <div className="container mx-auto">
            <div className="flex flex-wrap -mx-1 lg:-mx-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
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
          <ReactMapGL
            width="100%"
            height="100%"
            latitude={viewPort.latitude}
            longitude={viewPort.longitude}
            zoom={viewPort.zoom}
            onViewportChange={(viewport) => setViewPort(viewport)}
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            transitionInterpolator={new FlyToInterpolator()}
          />
        </div>
      </div>
    </div>
  );
}

const SkeletonCard = () => (
  <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
    <article className="overflow-hidden rounded-lg shadow-lg">
      <a href="#">
        <Skeleton height={150} width="100%" />
      </a>
      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
        <h1 className="w-full">
          <Skeleton height={30} />
        </h1>
      </header>
      <footer className="flex items-center justify-between leading-none p-2 md:p-4">
        <a className="flex items-center no-underline hover:underline text-black" href="#">
          <Skeleton circle={true} height={32} width={32} />
          <p className="ml-2">
            <Skeleton height={25} width={125} />
          </p>
        </a>
      </footer>
    </article>
  </div>
);

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
