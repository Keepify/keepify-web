import { NextPage, NextPageContext } from 'next';
import { DropzoneListItem } from 'types/dropzone';
import Link from 'next/link';
import { getLocationByCode } from 'services/map';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from 'public/dropzone/pin';
import { useState } from 'react';
import { Archive, Briefcase } from 'react-feather';

const DropzoneDetails: NextPage<Props> = ({ details, location }) => {
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: details.location.latitude,
    longitude: details.location.longitude,
    zoom: 12,
  } as ViewportProps);

  return (
    <div>
      <nav className="w-full bg-purple shadow-xl relative">
        <div className="max-w-screen-lg my-0 h-20 mx-auto flex justify-between items-center">
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
      <div className="w-full">
        <img src={details.photo_urls[0]} alt="thumbnail" className="w-full object-cover h-72" />
      </div>

      <div className="max-w-screen-lg my-0 mx-auto pt-20">
        <div className="w-4/6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{details.location_name}</h1>
            <span className="text-xl font-bold">
              {details.cost.currency}
              {details.cost.rate}/{details.cost.unit}
            </span>
          </div>
          <h3 className="text-md text-grey pt-2">{location}</h3>
          <hr className="w-full h-0.5 mt-8 bg-white opacity-20 pb-10" />

          <h2 className="text-2xl pb-4">Services Available</h2>
          <div className="flex flex-wrap -mx-1 lg:-mx-4">
            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
              <div className="shadow-2xl rounded-lg p-6">
                <div className="pb-3">
                  <Briefcase size={36} color="#FF8E6E" />
                </div>
                <h3 className="font-bold text-lg pb-2">In-person Deposit</h3>
                <p className="text-sm">
                  You may bring the item(s) to be kept in-person during work-hours.
                </p>
              </div>
            </div>
            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
              <div className="shadow-2xl rounded-lg p-6">
                <div className="pb-3">
                  <Archive size={36} color="#FF8E6E" />
                </div>
                <h3 className="font-bold text-lg pb-2">Online Order Delivery</h3>
                <p className="text-sm">
                  You can fill in with our address instead of yours for your online delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/6"></div>
      </div>
      <div className="max-w-screen-lg my-0 mx-auto pt-10">
        <h2 className="text-2xl">Location</h2>
        <div className="pt-6 w-full h-80">
          <ReactMapGL
            {...viewPort}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => setViewPort(viewport)}
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker
              latitude={details.location.latitude}
              longitude={details.location.longitude}
              offsetTop={-48}
              offsetLeft={-24}
            >
              <Pin />
            </Marker>
          </ReactMapGL>
        </div>
      </div>
    </div>
  );
};

type Props = {
  details: DropzoneListItem;
  location: string;
};

DropzoneDetails.getInitialProps = async (ctx: NextPageContext) => {
  const dummy: DropzoneListItem = {
    id: 'd1',
    location: {
      latitude: 39.8870344,
      longitude: 32.8455316,
    },
    photo_urls: [`https://picsum.photos/id/${Math.floor(Math.random() * 81 + 1000)}/1920/720/`],
    host: {
      id: 'h1',
      first_name: 'Vida',
      last_name: 'André',
      photo: `https://picsum.photos/id/${Math.floor(Math.random() * 81 + 1000)}/32/32/`,
    },
    location_name: 'Sheraton Hotel',
    cost: {
      rate: 1.5,
      currency: '$',
      unit: 'day',
    },
  };

  const location = await getLocationByCode(dummy.location);

  return {
    details: dummy,
    location: `${location[0]} ${location[1]}`,
  };
};

export default DropzoneDetails;
