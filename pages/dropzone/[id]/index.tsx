import { NextPage, NextPageContext } from 'next';
import { DropzoneListItem } from 'types/dropzone';
import Link from 'next/link';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from 'public/dropzone/pin';
import { useMemo, useRef, useState } from 'react';
import { Archive, Briefcase, Star, Plus, Minus, Menu, X } from 'react-feather';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Button from 'components/Button';
import { motion } from 'framer-motion';
import { getDropzone, toggleDropzoneStatus } from 'services/dropzone';
import { useUserInfo } from 'hooks/redux';
import { useRouter } from 'next/router';
import Drawer from 'components/Drawer';
import { useDispatch } from 'react-redux';
import { setEndTime, setItems, setStartTime } from 'actions/order';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { PageContext } from 'types';
import { redirect } from 'middlewares/redirect';
import Modal from 'components/Modal';
import { errorNotification } from 'helpers/notification';
import Loader from 'components/Loader';
import Head from 'next/head';

const DropzoneDetails: NextPage<Props> = ({ details, location }) => {
  console.log({ details });
  const Router = useRouter();
  const { query } = Router;
  const { isLogin, userInfo } = useUserInfo();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: details.location.lat,
    longitude: details.location.lng,
    zoom: 12,
  } as ViewportProps);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [itemsNum, setItemsNum] = useState(1);
  const [isActive, setIsActive] = useState(details.active);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toRef = useRef(null);

  const canBook = useMemo(() => {
    return !!from && !!to && !!itemsNum;
  }, [from, to, itemsNum]);

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

  function book() {
    const order = {
      from,
      to,
      itemsNum,
    };
    dispatch(setStartTime(from));
    dispatch(setEndTime(to));
    dispatch(setItems(itemsNum));
    sessionStorage.setItem('orderInfo', JSON.stringify(order));

    Router.push(
      isLogin
        ? `/dropzone/${query.id}/book`
        : `/login?r=${encodeURIComponent(`/dropzone/${query.id}/book`)}`
    );
  }

  async function handleDropzoneStatus() {
    try {
      setIsLoading(true);
      await toggleDropzoneStatus(details.id, !isActive);
      setIsActive((prev) => !prev);
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (e) {
      setIsLoading(false);
      errorNotification(
        'Error',
        'An error occurred while toggling the dropzone status. Please try again later.'
      );
    }
  }

  return (
    <article>
      {isLoading && <Loader />}
      <Head>
        <title>Keepify | {details.name}</title>
      </Head>
      <Drawer show={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <li className="pb-4">
          <Link href="/">
            <a className="text-orange-light text-xl tracking-widest font-bold">Keepify</a>
          </Link>
        </li>
        <li className="pb-4">
          <Link href={isLogin ? '/profile' : '/login'}>
            <a className="text-white text-xl tracking-wider">{isLogin ? 'Profile' : 'Login'}</a>
          </Link>
        </li>
      </Drawer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-silver shadow-2xl rounded-xl max-w-3/4 lg:w-120 w-full p-8 relative flex overflow-hidden">
          <span
            className="absolute top-8 right-8 cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} color="#000" />
          </span>
          <div className="w-full flex flex-col">
            <p className="font-bold pb-8 text-lg pr-6">
              Are you sure to {isActive ? 'inactivate' : 'activate'} the dropzone?
            </p>
            <div>
              <Button className="w-full" onClick={handleDropzoneStatus}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <nav className="w-full bg-purple shadow-xl relative">
        <div className="lg:max-w-screen-lg lg:w-full w-10/12 my-0 h-20 mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-orange-light text-xl tracking-widest font-bold lg:inline hidden">
              Keepify
            </a>
          </Link>
          <ul className="lg:flex flex-row hidden">
            {userInfo.role !== '1' && (
              <li>
                <Link href="/about">
                  <a
                    className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition"
                    href="https://k1mkuyv4azb.typeform.com/to/SLNsiRUn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Become a Host
                  </a>
                </Link>
              </li>
            )}
            <li>
              <Link href="/dropzones">
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  Dropzones
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
          <div className="lg:hidden flex">
            <span className="cursor-pointer" onClick={() => setIsMenuOpen(true)}>
              <Menu size={36} color="#fff" />
            </span>
          </div>
        </div>
      </nav>
      <div className="w-full">
        <img src={details.thumbnail} alt="thumbnail" className="w-full object-cover h-72" />
      </div>

      <div className="lg:max-w-screen-lg lg:w-full w-10/12 mx-auto pt-20 flex lg:flex-row flex-col-reverse">
        <div className="lg:w-4/6 w-full lg:mr-12 mr-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{details.name}</h1>
            <div className="text-xl font-bold flex">
              <Star fontSize={12} color="#FF8E6E" />
              <span className="ml-2">{details.rating}</span>
            </div>
          </div>
          <h3 className="text-md text-grey pt-2">{location}</h3>
          <hr className="w-full h-0.5 mt-4 bg-white opacity-20 mb-10" />

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
        <div className="lg:w-2/6 w-full">
          {details.host.id === userInfo.id ? (
            <div className="shadow-2xl rounded-lg p-8 lg:mb-0 mb-10">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Dropzone Status</p>
                <div className="flex items-center">
                  <Toggle
                    checked={isActive}
                    icons={false}
                    onChange={() => {
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              </div>
              <p className="text-sm pt-8">
                {isActive
                  ? 'After setting the dropzone to being inactive, it will no longer appear within the search results. However, it would not cancel any ongoing transaction if there is any.'
                  : 'After setting the dropzone to being active, it will start to appear within the search results.'}
              </p>
            </div>
          ) : (
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
                <a className={`pointer-events-${canBook ? 'auto' : 'none'}`} onClick={book}>
                  <Button className="w-full">Book Now</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:max-w-screen-lg lg:w-full w-10/12 mx-auto pt-10">
        <h2 className="text-2xl">Location</h2>
      </div>
      <div className="pt-6 lg:max-w-screen-lg mx-auto max-w-full w-full h-80">
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
    </article>
  );
};

type Props = {
  details: DropzoneListItem;
  location: string;
};

DropzoneDetails.getInitialProps = async (ctx: PageContext) => {
  const { query } = ctx;
  const { userInfo } = ctx.store.getState().user;
  const dropzone = await getDropzone(query.id as string);

  // only the host can view an inactive dropzone
  if (!dropzone.active && userInfo.id !== dropzone.host.id) {
    redirect(ctx.res, '/');
  }
  // const location = await getLocationByCode({
  //   latitude: dropzone.location.lat,
  //   longitude: dropzone.location.lng,
  // });

  return {
    details: dropzone,
    location: '', // `${location[0]} ${location[1]}`,
  };
};

export default DropzoneDetails;
