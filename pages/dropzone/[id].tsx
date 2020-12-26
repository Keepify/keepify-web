import { NextPage, NextPageContext } from 'next';
import { DropzoneListItem } from 'types/dropzone';
import Link from 'next/link';
import { getLocationByCode } from 'services/map';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from 'public/dropzone/pin';
import { useRef, useState } from 'react';
import { Archive, Briefcase, Star, Plus, Minus } from 'react-feather';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Button from 'components/Button';
import { motion } from 'framer-motion';
import { getDropzone } from 'services/dropzone';
import { useUserInfo } from 'hooks/redux';

const DropzoneDetails: NextPage<Props> = ({ details, location }) => {
  const user = useUserInfo();
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: details.location.lat,
    longitude: details.location.lng,
    zoom: 12,
  } as ViewportProps);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [itemsNum, setItemsNum] = useState(1);
  const toRef = useRef(null);

  function decreaseNum() {
    if (itemsNum > 1) {
      setItemsNum((prev) => prev - 1);
    }
  }

  function increaseNum() {
    if (itemsNum < 10) {
      setItemsNum((prev) => prev + 1);
    }
  }

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
              <Link href={user ? '/profile' : '/login'}>
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  {user ? 'Profile' : 'Login'}
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="w-full">
        <img src={details.thumbnail} alt="thumbnail" className="w-full object-cover h-72" />
      </div>

      <div className="max-w-screen-lg my-0 mx-auto pt-20 flex">
        <div className="w-4/6 mr-12">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{details.name}</h1>
            <div className="text-xl font-bold flex">
              <Star fontSize={12} color="#FF8E6E" />
              <span className="ml-2">{details.rating}</span>
            </div>
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
                  You may bring the item(s) to be kept personally during work-hours.
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
        <div className="w-2/6">
          <div className="shadow-2xl rounded-lg p-8">
            <p className="text-xl font-bold">${details.rate}/day</p>
            <p className="pt-6 pb-2 font-bold">Dates</p>
            <div className="flex">
              <div className="w-1/2">
                <DayPickerInput
                  value={from}
                  placeholder="Drop-off"
                  format="LL"
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { after: to },
                    toMonth: to,
                    modifiers: { start: from, end: to },
                    numberOfMonths: 2,
                    onDayClick: () => toRef.current.getInput().focus(),
                  }}
                  onDayChange={(date) => setFrom(date)}
                />
              </div>
              <div className="w-1/2">
                <DayPickerInput
                  ref={toRef}
                  value={to}
                  placeholder="Pickup"
                  format="LL"
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { before: from },
                    modifiers: { start: from, end: to },
                    month: from,
                    fromMonth: from,
                    numberOfMonths: 2,
                  }}
                  onDayChange={(date) => setTo(date)}
                />
              </div>
            </div>

            <p className="pt-4 pb-2 font-bold">Number of Items</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">{itemsNum}</span>
              <div className="flex">
                <motion.span
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center w-6 h-6 mr-1 shadow-2xl rounded-xl cursor-pointer"
                  onClick={decreaseNum}
                >
                  <Minus size={16} />
                </motion.span>
                <motion.span
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center w-6 h-6 shadow-2xl rounded-xl cursor-pointer"
                  onClick={increaseNum}
                >
                  <Plus size={16} />
                </motion.span>
              </div>
            </div>

            <div className="pt-8">
              <Button className="w-full">Book Now</Button>
            </div>
          </div>
        </div>
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
              latitude={details.location.lat}
              longitude={details.location.lng}
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
  const { query } = ctx;
  const dropzone = await getDropzone(query.id as string);
  const location = await getLocationByCode({
    latitude: dropzone.location.lat,
    longitude: dropzone.location.lng,
  });

  return {
    details: dropzone,
    location: `${location[0]} ${location[1]}`,
  };
};

export default DropzoneDetails;
