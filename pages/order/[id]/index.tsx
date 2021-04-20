import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from 'public/dropzone/pin';
import { getTransaction, updateTransactionStatus } from 'services/transactions';
import { Transaction, TStatus } from 'types/transaction';
import moment from 'moment';
import { useState } from 'react';
import { Star, Mail } from 'react-feather';
import { useUserInfo } from 'hooks/redux';
import Button from 'components/Button';
import { errorNotification } from 'helpers/notification';
import Loader from 'components/Loader';
import { capitalize } from 'helpers/string';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const OrderDetails: NextPage<Props> = ({ transaction, location }) => {
  const { userInfo } = useUserInfo();
  const { query } = useRouter();
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: transaction.dropzone.location.lat,
    longitude: transaction.dropzone.location.lng,
    zoom: 12,
  } as ViewportProps);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<TStatus>(transaction.status);

  console.log({ transaction });

  async function switchStatus() {
    try {
      setIsLoading(true);

      switch (status) {
        case TStatus.PAID:
          await updateTransactionStatus(transaction.id, TStatus.CONFIRMED);
          setStatus(TStatus.CONFIRMED);
          break;
        case TStatus.CONFIRMED:
          await updateTransactionStatus(transaction.id, TStatus.RECEIVED);
          setStatus(TStatus.RECEIVED);
          break;
        default:
          await updateTransactionStatus(transaction.id, TStatus.CONFIRMED);
          setStatus(TStatus.CONFIRMED);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorNotification('Error', 'An error occurred. Please try again later.');
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <article className="bg-silver pt-8 pb-12 min-h-screen w-full">
        <Link href="/">
          <a>
            <nav className="text-center text-orange-light text-lg tracking-widest font-bold">
              Keepify
            </nav>
          </a>
        </Link>
        <main className="pt-10 max-w-screen-lg mx-auto">
          <header className="bg-full-white py-4 px-6 flex justify-between items-center rounded-md">
            <h2 className="text-xl font-bold">Order: {transaction.id.split('-')[4]}</h2>
            <span className="bg-green text-white px-6 py-3 rounded-full text-center">
              {capitalize(status)}
            </span>
          </header>

          <div className="mt-8 flex items-start">
            <article className="w-3/5 mr-8 py-6 px-10 bg-full-white rounded-md">
              {[TStatus.PAID, TStatus.CONFIRMED].includes(status) && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <label className="tracking-wider text-lg">
                      {status === TStatus.PAID ? 'Accept this order?' : 'Received order item(s)?'}
                    </label>
                    <Button className="bg-green text-white rounded-full" onClick={switchStatus}>
                      Confirm
                    </Button>
                  </div>
                  <hr className="w-full h-0.5 my-4 bg-white opacity-20" />
                </>
              )}

              <div className="mb-4 flex justify-between items-center">
                <label className="tracking-wider text-lg">Order Total</label>
                <label className="tracking-wider text-xl font-bold">${transaction.cost} USD</label>
              </div>
              <div className="mb-2 flex justify-between items-center">
                <label className="tracking-wider text-lg">Reservation Period</label>
              </div>
              <div className="mb-1 flex justify-between items-center">
                <label className="tracking-widest text-orange text-sm">Starting Time</label>
                <label className="tracking-widest text-sm">
                  {moment(transaction.reservation_start).format('YYYY/MM/DD H:mm A')}
                </label>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <label className="tracking-widest text-orange text-sm">Ending Time</label>
                <label className="tracking-widest text-sm">
                  {moment(transaction.reservation_end).format('YYYY/MM/DD H:mm A')}
                </label>
              </div>
              {/* <div className="mb-4 flex justify-between items-center">
              <label className="tracking-wider text-lg">Client Notes</label>
            </div>
            <p className="tracking-wider text-sm">
              I will be bringing 2 luggages that each weight 20kgs, please keep them carefully!
            </p> */}
              {status === TStatus.RECEIVED && (
                <>
                  <div className="my-4">
                    <label className="tracking-wider text-lg">Client Redeem Code</label>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <QRCode
                        size={200}
                        value={`https://keepify.vercel.app/order/${query.id}?token=${transaction.host_token}`}
                      />
                    </div>
                    <div className="flex flex-col items-center ml-8">
                      <Image src="/order/scan_redeem.svg" width={250} height={180} alt="scan_qr" />
                      <p className="text-dark tracking-widest text-center mt-3">
                        Please show this QR code to the client when redeeming back the kept item(s)
                        in order to close the order!
                      </p>
                    </div>
                  </div>
                </>
              )}
            </article>
            <aside className="w-2/5 bg-full-white rounded-md overflow-hidden">
              <div className="w-full">
                <ReactMapGL
                  width="100%"
                  height={250}
                  mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  {...viewPort}
                  onViewportChange={(viewport) => {
                    setViewPort(viewport);
                  }}
                >
                  <Marker
                    latitude={transaction.dropzone.location.lat}
                    longitude={transaction.dropzone.location.lng}
                    offsetTop={-48}
                    offsetLeft={-24}
                  >
                    <Pin />
                  </Marker>
                </ReactMapGL>
              </div>
              <section className="py-8 px-10">
                <div className="mb-2 flex justify-between items-center">
                  <label className="tracking-wider text-lg">{transaction.dropzone.name}</label>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <label className="tracking-wider text-sm text-grey">{location}</label>
                  <div className="text-sm font-bold flex">
                    <Star style={{ width: 18, height: 18 }} color="#FF8E6E" />
                    <span className="ml-2">{transaction.dropzone.rating}</span>
                  </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                  <label className="tracking-wider text-lg">Host Information</label>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <label className="tracking-wider text-sm">
                    {transaction.dropzone.host.fname} {transaction.dropzone.host.lname}
                  </label>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <div className="text-sm flex">
                    <Mail style={{ width: 18, height: 18 }} color="#000000" />
                    <label className="tracking-wider text-sm ml-4">
                      {transaction.dropzone.host.email}
                    </label>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </article>
    </>
  );
};

type Props = {
  transaction: Transaction;
  location: string;
};

OrderDetails.getInitialProps = async (ctx: PageContext) => {
  try {
    const { isLogin } = ctx.store.getState().user;
    if (!isLogin) {
      throw new Error('Not logged in');
    }

    const transaction = await getTransaction(ctx.query.id as string);
    // const location = await getLocationByCode({
    //   latitude: transaction.dropzone.location.lat,
    //   longitude: transaction.dropzone.location.lng,
    // });

    return {
      transaction,
      location: 'Çankaya/Ankara, Turkey', // `${location[0]} ${location[1]}`,
    };
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default OrderDetails;
