import { redirect } from 'middlewares/redirect';
import { PageContext } from 'types';
import Image from 'next/image';
import Link from 'next/link';
import { NextPage } from 'next';
import { verifyQRToken } from 'services/transactions';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import setAuthToken from 'helpers/token';
import { useRouter } from 'next/router';

const RedeemPage: NextPage<Props> = ({ success }) => {
  const { query } = useRouter();

  return (
    <article className="w-full min-h-screen bg-purple">
      <Head>
        <title>Keepify | {success ? 'Redeem Successful!' : 'Redeem Failed!'}</title>
      </Head>
      <nav className="w-full bg-purple py-20 lg:px-24 flex justify-center">
        <Link href="/">
          <a className="text-orange-light text-xl tracking-widest font-bold text-center">Keepify</a>
        </Link>
      </nav>
      <div className="pb-14 w-10/12 mx-auto">
        {success ? (
          <div className="py-6 px-10 bg-full-white rounded-lg flex flex-col items-center">
            <Image
              src="/order/redeem_confirm.svg"
              width={250}
              height={250}
              alt="redeem_illustration"
            />
            <h3 className="mt-8 tracking-wider text-xl text-green">Success!</h3>
            <p className="mt-4 text-dark tracking-wider text-center">
              The item has been successfully redeemed. Thank you for using Keepify!
            </p>
            <a
              className="mt-4 text-orange font-bold"
              href={`/order/${query.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Leave a review for your journey!
            </a>
          </div>
        ) : (
          <div className="py-6 px-10 bg-full-white rounded-lg flex flex-col items-center">
            <Image
              src="/order/redeem_error.svg"
              width={250}
              height={250}
              alt="redeem_illustration"
            />
            <h3 className="mt-8 tracking-wider text-xl text-red">Failure!</h3>
            <p className="mt-4 text-dark tracking-wider text-center">
              The transaction has either been previously redeemed or you do not own this item.
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

type Props = {
  success: boolean;
};

RedeemPage.getInitialProps = async (ctx: PageContext) => {
  try {
    const cookies = nextCookie(ctx);
    if (cookies['_ap.ut']) {
      // set JWT token to axios header
      setAuthToken(cookies['_ap.ut']);
    }

    const { token } = ctx.query;
    if (!token) throw new Error('Token not found');

    const { isLogin } = ctx.store.getState().user;

    if (!isLogin) {
      redirect(
        ctx.res,
        `/login?r=${encodeURIComponent(`/order/${ctx.query.id}/redeem?token=` + token)}`
      );
    }

    try {
      await verifyQRToken(ctx.query.id as string, token as string);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default RedeemPage;
