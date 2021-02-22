import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import ReactMapGL, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const OrderDetails: NextPage = () => {
  return (
    <div className="bg-silver pt-8 min-h-screen w-full">
      <Link href="/">
        <a>
          <nav className="text-center text-orange-light text-lg tracking-widest font-bold">
            Keepify
          </nav>
        </a>
      </Link>
      <main className="pt-10 max-w-screen-lg mx-auto">
        <header className="bg-full-white py-4 px-6 flex justify-between items-center rounded-md">
          <h2 className="text-xl font-bold">Order #75832124</h2>
          <span className="bg-green text-white w-32 py-2 rounded-full text-center">Paid</span>
        </header>

        <div className="mt-8 flex">
          <article className="w-3/5 mr-8 py-6 px-6 bg-full-white rounded-md">
            <div className="mb-4 flex justify-between items-center">
              <label className="tracking-wider text-lg">Order Total</label>
              <label className="tracking-wider text-xl font-bold">$8.25 USD</label>
            </div>
            <div className="mb-2 flex justify-between items-center">
              <label className="tracking-wider text-lg">Reservation Period</label>
            </div>
            <div className="mb-1 flex justify-between items-center">
              <label className="tracking-widest text-orange text-sm">Starting Time</label>
              <label className="tracking-widest text-sm">2021/03/29 10:00 AM</label>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <label className="tracking-widest text-orange text-sm">Ending Time</label>
              <label className="tracking-widest text-sm">2021/03/30 13:00 PM</label>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <label className="tracking-wider text-lg">Client Notes</label>
            </div>
            <p className="tracking-wider text-sm">
              I will be bringing 2 luggages that each weight 20kgs, please keep them carefully!
            </p>
          </article>
          <aside className="w-2/5 bg-full-white rounded-md overflow-hidden">
            <div className="w-full">
              <ReactMapGL
                width="100%"
                height={250}
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

type Props = {};

OrderDetails.getInitialProps = async (ctx: PageContext) => {
  try {
    // const { isLogin } = ctx.store.getState().user;
    // if (!isLogin) {
    //   throw new Error('Not logged in');
    // }
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default OrderDetails;
