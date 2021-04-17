import { FormEvent, useEffect, useMemo, useState } from 'react';
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
import { clearOrder, setEndTime, setItems, setStartTime } from 'actions/order';
import { useOrderInfo } from 'hooks/redux';
import moment from 'moment';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Input from 'components/Input';
import Button from 'components/Button';
import Loader from 'components/Loader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);

const options = {
  style: {
    base: {
      color: '#000',
      fontSize: '16px',
      letterSpacing: '0.9px',
      fontFamily: 'Sen',
      '::placeholder': {
        color: '#ccc',
      },
    },
    invalid: {
      color: '#71747D',
    },
  },
};

const BookDropzone: NextPage<Props> = ({ details }) => {
  const Router = useRouter();
  const dispatch = useDispatch();
  const orderInfo = useOrderInfo();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCardNumberComplete, setisCardNumberComplete] = useState(false);
  const [isExpiredDateComplete, setIsExpiredDateComplete] = useState(false);
  const [isCVCComplete, setIsCVCComplete] = useState(false);

  const isCardInfoComplete = useMemo(() => {
    return isCardNumberComplete && isExpiredDateComplete && isCVCComplete;
  }, [isCardNumberComplete, isExpiredDateComplete, isCVCComplete]);

  const totalDays = useMemo(() => {
    return Number(moment(orderInfo.endTime).diff(moment(orderInfo.startTime), 'days')) + 1;
  }, [orderInfo]);

  useEffect(() => {
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')) as {
      from: string;
      to: string;
      itemsNum: number;
    };

    if (orderInfo) {
      dispatch(setStartTime(orderInfo.from));
      dispatch(setEndTime(orderInfo.to));
      dispatch(setItems(orderInfo.itemsNum));
    }
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    if (!isCardInfoComplete) return;

    const cardElement = elements.getElement(CardNumberElement);

    try {
      setIsLoading(true);

      const { token } = await stripe.createToken(cardElement);
      console.log(token);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  return (
    <article>
      {isLoading && <Loader />}
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
        <form onSubmit={onSubmit} className="w-3/5 mr-12">
          <h1 className="text-3xl font-bold mb-10">Checkout</h1>

          <div className="pb-6">
            <label className="text-dark text-sm mb-2">Credit Card Number</label>
            <div className="mt-2">
              <CardNumberElement
                options={options}
                onChange={(event) => setisCardNumberComplete(event.complete)}
              />
            </div>
          </div>

          <div className="pb-6 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="text-dark text-sm mb-2">Expiration Date</label>
              <div className="mt-2">
                <CardExpiryElement
                  options={options}
                  onChange={(event) => setIsExpiredDateComplete(event.complete)}
                />
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <label className="text-dark text-sm mb-2">CVC</label>
              <div className="mt-2">
                <CardCvcElement
                  options={options}
                  onChange={(event) => setIsCVCComplete(event.complete)}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className={`w-full mt-6 pointer-events-${isCardInfoComplete ? 'auto' : 'none'}`}
            >
              Place Order
            </Button>
          </div>
        </form>
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

const StripeWrapper: NextPage<Props> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <BookDropzone {...props} />
    </Elements>
  );
};

StripeWrapper.getInitialProps = async (ctx: PageContext) => {
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

export default StripeWrapper;
