import ReactMapGL, { ViewportProps, FlyToInterpolator, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import Input from 'components/Input';
import { Search } from 'react-feather';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LatLng } from 'types';
import { getGeocode } from 'services/map';
import { getDropzones } from 'services/dropzone';
import { useDebouncedCallback } from 'use-debounce';
import Image from 'next/image';
import { DropzoneListItem } from 'types/dropzone';
import DropzoneCard, { SkeletonCard } from 'components/DropzoneCard';
import Pin from 'public/dropzone/pin';
import { useUserInfo } from 'hooks/redux';

export default function Dropzones() {
  const { query } = useRouter();
  const { isLogin } = useUserInfo();
  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    latitude: query.lat ? Number(query.lat) : 0,
    longitude: query.lng ? Number(query.lng) : 0,
  });
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: 40.738841,
    longitude: -74.0272836,
    zoom: 12,
  } as ViewportProps);
  const [isLoading, setIsLoading] = useState(false);
  const [dropzoneList, setDropzoneList] = useState<DropzoneListItem[]>([]);
  const debouncedSearch = useDebouncedCallback(searchDropzone, 500);
  const debouncedFetchDropzones = useDebouncedCallback(fetchDropzones, 500);

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
    (async () => {
      if (currentLocation.latitude && currentLocation.longitude) {
        setIsLoading(true);
        const data = await getDropzones(currentLocation);

        if (data.length) {
          setDropzoneList(data);
          setViewPort((prev) => ({
            ...prev,
            latitude: data[0].location.lat,
            longitude: data[0].location.lng,
            transitionDuration: 300,
            transitionInterpolator: new FlyToInterpolator(),
          }));
        }
        setIsLoading(false);
      }
    })();
  }, [currentLocation]);

  async function fetchDropzones() {
    setIsLoading(true);
    const data = await getDropzones({ latitude: viewPort.latitude, longitude: viewPort.longitude });

    setDropzoneList(data);
    setIsLoading(false);
  }

  async function searchDropzone(query: string) {
    if (query.trim().length) {
      const list = await getGeocode(query);

      if (list?.features?.length) {
        await fetchDropzones();
        // move to the center of the first result
        setViewPort((prev) => ({
          ...prev,
          zoom: 14,
          latitude: list.features[0].center[1],
          longitude: list.features[0].center[0],
          transitionDuration: 300,
          transitionInterpolator: new FlyToInterpolator(),
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
              <Link href={isLogin ? '/profile' : '/login'}>
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  {isLogin ? 'Profile' : 'Login'}
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex dropzone-container">
        <div className="w-3/5 overflow-y-auto bg-full-white py-12 px-7">
          <div className="pb-12 w-72">
            <Input
              containerClassName="bg-light-purple rounded-xl"
              className="bg-light-purple"
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
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                dropzoneList.map((dropzone, i) => (
                  <DropzoneCard
                    {...dropzone}
                    key={i}
                    onHover={() => {
                      setViewPort((prev) => ({
                        ...prev,
                        latitude: dropzone.location.lat,
                        longitude: dropzone.location.lng,
                        transitionDuration: 300,
                        transitionInterpolator: new FlyToInterpolator(),
                      }));
                    }}
                    currentLocation={query.lat && query.lng ? currentLocation : null}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="w-2/5 mr-auto">
          <ReactMapGL
            {...viewPort}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => {
              setViewPort(viewport);
              debouncedFetchDropzones.callback();
            }}
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {dropzoneList.map((dropzone, i) => (
              <Marker
                key={i}
                latitude={dropzone.location.lat}
                longitude={dropzone.location.lng}
                offsetTop={-48}
                offsetLeft={-24}
              >
                <Pin />
              </Marker>
            ))}
          </ReactMapGL>
        </div>
      </div>
    </div>
  );
}
