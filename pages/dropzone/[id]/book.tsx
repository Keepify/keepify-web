import { useMemo, useState } from 'react';
import Drawer from 'components/Drawer';
import Link from 'next/link';
import { Menu, ArrowLeft } from 'react-feather';
import { NextPage } from 'next';
import { PageContext } from 'types';
import { redirect } from 'middlewares/redirect';
import { getDropzone } from 'services/dropzone';
import { DropzoneListItem } from 'types/dropzone';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearOrder } from 'actions/order';
import { useOrderInfo } from 'hooks/redux';
import moment from 'moment';

const BookDropzone: NextPage<Props> = ({ details }) => {
  const Router = useRouter();
  const dispatch = useDispatch();
  const orderInfo = useOrderInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalDays = useMemo(() => {
    return Number(moment(orderInfo.endTime).diff(moment(orderInfo.startTime), 'days'));
  }, [orderInfo]);

  return (
    <article>
      <Drawer show={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <li className="pb-4">
          <Link href="/">
            <a className="text-orange-light text-xl tracking-widest font-bold">Keepify</a>
          </Link>
        </li>
        <li className="pb-4">
          <Link href="/profile">
            <a className="text-white text-xl tracking-wider">Profile</a>
          </Link>
        </li>
      </Drawer>
      <nav className="w-full bg-purple shadow-xl relative">
        <div className="lg:max-w-screen-lg max-w-3/4 my-0 h-20 mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-orange-light text-xl tracking-widest font-bold lg:inline hidden">
              Keepify
            </a>
          </Link>
          <ul className="lg:flex flex-row hidden">
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
            <li>
              <Link href="/profile">
                <a className="text-white text-md tracking-wider pl-8 hover:text-orange-light transition">
                  Profile
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

      <div className="max-w-screen-lg my-0 mx-auto pt-20 pb-14">
        <Link href={`/dropzone/${Router.query.id}`}>
          <a
            className="flex items-center text-orange cursor-pointer"
            onClick={() => dispatch(clearOrder())}
          >
            <ArrowLeft className="mr-2" size={24} color="#FF8E6E" />
            Back to Details
          </a>
        </Link>
      </div>

      <div className="max-w-screen-lg my-0 mx-auto flex">
        <div className="w-3/5 mr-12">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        <div className="w-2/5">
          <div className="shadow-2xl rounded-lg p-8">
            <label className="tracking-wider text-lg block mb-4">Order Summary</label>
            <div className="mb-2 flex justify-between items-center">
              <label className="tracking-widest text-orange text-sm">Start</label>
              <label className="tracking-widest text-sm">
                {moment(orderInfo.startTime).format('YYYY/MM/DD H:mm A')}
              </label>
            </div>
            <div className="mb-5 flex justify-between items-center">
              <label className="tracking-widest text-orange text-sm">End</label>
              <label className="tracking-widest text-sm">
                {moment(orderInfo.endTime).format('YYYY/MM/DD H:mm A')}
              </label>
            </div>
            <div className="mb-2 flex justify-between items-center">
              <label className="tracking-widest text-sm">Price</label>
              <label className="tracking-widest text-sm">${details.rate}/day</label>
            </div>
            <div className="mb-2 flex justify-between items-center">
              <label className="tracking-widest text-sm">Number of Items</label>
              <label className="tracking-widest text-sm">x{orderInfo.items}</label>
            </div>

            <hr className="w-full h-0.5 mt-4 bg-white opacity-20 mb-4" />

            <div className="mb-2 flex justify-between items-center">
              <label className="tracking-widest text-lg font-bold">Total</label>
              <label className="tracking-widest text-lg font-bold">
                ${(details.rate * orderInfo.items * totalDays).toFixed(2)}
              </label>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

type Props = {
  details: DropzoneListItem;
};

BookDropzone.getInitialProps = async (ctx: PageContext) => {
  try {
    const { query } = ctx;
    const dropzone = await getDropzone(query.id as string);

    return {
      details: dropzone,
    };
  } catch (e) {
    redirect(ctx.res, `/dropzone/${ctx.query.id}`);
  }
};

export default BookDropzone;
