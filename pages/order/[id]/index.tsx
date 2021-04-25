import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from 'public/dropzone/pin';
import { getTransaction, sendClientReview, updateTransactionStatus } from 'services/transactions';
import { Transaction, TStatus } from 'types/transaction';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Star, Mail, X } from 'react-feather';
import { useUserInfo } from 'hooks/redux';
import Button from 'components/Button';
import { errorNotification } from 'helpers/notification';
import Loader from 'components/Loader';
import { capitalize } from 'helpers/string';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Modal from 'components/Modal';

const OrderDetails: NextPage<Props> = ({ transaction }) => {
  console.log({ transaction });
  const { userInfo } = useUserInfo();
  const { query } = useRouter();
  const [viewPort, setViewPort] = useState<ViewportProps>({
    latitude: transaction.dropzone.location.lat,
    longitude: transaction.dropzone.location.lng,
    zoom: 12,
  } as ViewportProps);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<TStatus>(transaction.status);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const [clientReview, setClientReview] = useState(transaction.client_review);
  const [clientStars, setClientStars] = useState(transaction.client_stars);

  const [confirmModal, setConfirmModal] = useState(false);

  const isClient = transaction.host.id !== userInfo.id;

  const isReviewed = useMemo(() => {
    return !!clientReview && clientReview.length && !!clientStars;
  }, [clientReview, clientStars]);

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
      setConfirmModal(false);
    } catch (e) {
      setIsLoading(false);
      errorNotification('Error', 'An error occurred. Please try again later.');
    }
  }

  async function submitReview() {
    try {
      setIsLoading(true);

      await sendClientReview(transaction.id, reviewText, rating);

      setClientReview(reviewText);
      setClientStars(rating);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorNotification(
        'Error',
        'An error occurred while submitting your review. Please try again later.'
      );
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <title>Keepify | {transaction.dropzone.name}</title>
      </Head>

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
        <div className="bg-silver shadow-2xl rounded-xl max-w-3/4 lg:w-120 w-full p-8 relative flex overflow-hidden">
          <span
            className="absolute top-8 right-8 cursor-pointer"
            onClick={() => setConfirmModal(false)}
          >
            <X size={24} color="#000" />
          </span>
          <div className="w-full flex flex-col">
            <p className="font-bold text-lg pr-6">
              {status === TStatus.PAID
                ? 'Are you sure to accept this order?'
                : 'Are you sure that you have received the item(s)?'}
            </p>
            {status === TStatus.CONFIRMED && (
              <p className="pt-4 text-md">
                False information shall result into an invalid transaction.
              </p>
            )}
            <div className="pt-8">
              <Button className="w-full" onClick={switchStatus}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <article className="bg-silver pt-8 pb-12 min-h-screen w-full">
        <Link href="/">
          <a>
            <nav className="text-center text-orange-light text-lg tracking-widest font-bold">
              Keepify
            </nav>
          </a>
        </Link>
        <main className="pt-10 lg:max-w-screen-lg lg:w-full w-10/12 mx-auto">
          <header className="bg-full-white py-4 px-6 flex justify-between items-center rounded-md">
            <h2 className="lg:text-xl text-base font-bold">
              Order: {transaction.id.split('-')[4]}
            </h2>
            <span className="bg-green text-white px-6 py-3 ml-4 rounded-full text-center">
              {capitalize(status)}
            </span>
          </header>

          <div className="mt-8 flex lg:flex-row flex-col-reverse items-start">
            <article className="lg:w-3/5 w-full lg:mr-8 mr-0">
              <div className="bg-full-white rounded-md lg:py-6 py-5 lg:px-10 px-5">
                {!isClient && [TStatus.PAID, TStatus.CONFIRMED].includes(status) && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <label className="tracking-wider text-lg">
                        {status === TStatus.PAID ? 'Accept this order?' : 'Received order item(s)?'}
                      </label>
                      <Button
                        className="bg-green text-white rounded-full"
                        onClick={() => setConfirmModal(true)}
                      >
                        Confirm
                      </Button>
                    </div>
                    <hr className="w-full h-0.5 my-4 bg-white opacity-20" />
                  </>
                )}

                <div className="mb-4 flex justify-between items-center">
                  <label className="tracking-wider text-lg">Order Total</label>
                  <label className="tracking-wider text-xl font-bold">
                    ${transaction.cost} USD
                  </label>
                </div>
                <div className="mb-2 flex justify-between items-center">
                  <label className="tracking-wider text-lg">Reservation Period</label>
                </div>
                <div className="mb-1 flex justify-between items-center">
                  <label className="tracking-widest text-orange text-sm">Starting Time</label>
                  <label className="tracking-widest text-sm">
                    {moment(transaction.reservation_start).format('YYYY/MM/DD')}
                  </label>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <label className="tracking-widest text-orange text-sm">Ending Time</label>
                  <label className="tracking-widest text-sm">
                    {moment(transaction.reservation_end).format('YYYY/MM/DD')}
                  </label>
                </div>
                {transaction.client_note && (
                  <>
                    <div className="mb-4 flex justify-between items-center">
                      <label className="tracking-wider text-lg">Client Notes</label>
                    </div>
                    <p className="tracking-wider text-sm">{transaction.client_note}</p>
                  </>
                )}
                {status === TStatus.RECEIVED && (
                  <>
                    <div className="my-4">
                      <label className="tracking-wider text-lg">Client Redeem Code</label>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <QRCode
                          size={200}
                          value={`https://keepify.vercel.app/order/${query.id}/redeem?token=${transaction.host_token}`}
                        />
                      </div>
                      <div className="flex flex-col items-center ml-8">
                        <Image
                          src="/order/scan_redeem.svg"
                          width={250}
                          height={180}
                          alt="scan_qr"
                        />
                        <p className="text-dark tracking-widest text-center mt-3">
                          Please show this QR code to the client when redeeming back the kept
                          item(s) in order to close the order!
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isClient && status === TStatus.REDEEMED && (
                <div className="bg-full-white rounded-md lg:py-6 lg:px-10 py-3 px-5 mt-5">
                  <label className="tracking-wider text-lg block mb-4">Review</label>
                  <div className="flex justify-between items-center mb-4">
                    <label className="tracking-widest text-sm">
                      How was the overall experience?
                    </label>
                    <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                      {[...Array(5)].map((x, i) => (
                        <Star
                          key={i}
                          className="ml-1 cursor-pointer"
                          color={
                            rating > 0 && i < rating
                              ? '#FF8E6E'
                              : hoverRating > 0 && i < hoverRating
                              ? '#FFBB9E'
                              : '#7E7E7E'
                          }
                          fill={
                            rating > 0 && i < rating
                              ? '#FF8E6E'
                              : hoverRating > 0 && i < hoverRating
                              ? '#FFBB9E'
                              : '#fff'
                          }
                          size={16}
                          onMouseEnter={() => setHoverRating(i + 1)}
                          onClick={() => setRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>

                  <label className="tracking-widest text-sm block mb-4">
                    Do you have any feedback for us or for the host?
                  </label>

                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-white p-3 rounded-md resize-none"
                    rows={4}
                  />

                  <div className="flex justify-end pt-4">
                    <a
                      className={`pointer-events-${
                        reviewText.trim().length && rating ? 'auto' : 'none'
                      }`}
                    >
                      <Button onClick={submitReview}>Submit</Button>
                    </a>
                  </div>
                </div>
              )}
              {status === TStatus.REDEEMED && isReviewed && (
                <div className="bg-full-white rounded-md py-6 px-10 mt-5">
                  <label className="tracking-wider text-lg block mb-4">Review</label>
                  <div className="flex justify-between items-start mb-4">
                    <label className="tracking-widest text-sm">{clientReview}</label>
                    <div className="flex">
                      {[...Array(5)].map((x, i) => (
                        <Star
                          key={i}
                          className="ml-1"
                          color={i < clientStars ? '#FF8E6E' : '#7E7E7E'}
                          fill={i < clientStars ? '#FF8E6E' : '#fff'}
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
            <aside className="lg:w-2/5 w-full bg-full-white rounded-md overflow-hidden lg:mb-0 mb-10">
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
              <section className="lg:py-8 lg:px-10 py-4 px-5">
                <div className="mb-2 flex justify-between items-center">
                  <label className="tracking-wider text-lg">{transaction.dropzone.name}</label>
                  <div className="text-sm font-bold flex">
                    <Star style={{ width: 18, height: 18 }} color="#FF8E6E" />
                    <span className="ml-2">{transaction.dropzone.rating}</span>
                  </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                  <label className="tracking-wider text-lg">
                    {isClient ? 'Host Information' : 'Client Information'}
                  </label>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <label className="tracking-wider text-sm">
                    {isClient
                      ? `${transaction.host.fname} ${transaction.host.lname}`
                      : `${transaction.client.fname} ${transaction.client.lname}`}
                  </label>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <div className="text-sm flex">
                    <Mail style={{ width: 18, height: 18 }} color="#000000" />
                    <label className="tracking-wider text-sm ml-4">
                      {isClient ? transaction.host.email : transaction.client.email}
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
};

OrderDetails.getInitialProps = async (ctx: PageContext) => {
  try {
    const { isLogin } = ctx.store.getState().user;
    if (!isLogin) {
      throw new Error('Not logged in');
    }

    const transaction = await getTransaction(ctx.query.id as string);

    return {
      transaction,
    };
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default OrderDetails;
