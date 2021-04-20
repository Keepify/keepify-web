import { redirect } from 'middlewares/redirect';
import { PageContext } from 'types';
import Image from 'next/image';
import Link from 'next/link';

const RedeemPage = () => {
  return (
    <article className="w-full min-h-screen bg-purple">
      <nav className="w-full bg-purple py-20 lg:px-24 flex justify-center">
        <Link href="/">
          <a className="text-orange-light text-xl tracking-widest font-bold text-center">Keepify</a>
        </Link>
      </nav>
      <div className="pb-14 w-11/12 mx-auto">
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
        </div>

        {/* <div className="py-6 px-10 bg-full-white rounded-lg flex flex-col items-center">
          <Image src="/order/redeem_error.svg" width={250} height={250} alt="redeem_illustration" />
          <h3 className="mt-8 tracking-wider text-xl text-red">Failure!</h3>
          <p className="mt-4 text-dark tracking-wider text-center">
            The transaction has either been previously redeemed or you do not own this item.
          </p>
        </div> */}
      </div>
    </article>
  );
};

RedeemPage.getInitialProps = async (ctx: PageContext) => {
  try {
    const { token } = ctx.query;
    if (!token) throw new Error('Token not found');

    const { isLogin } = ctx.store.getState().user;

    if (!isLogin) {
      redirect(ctx.res, `/login?r=${encodeURIComponent('/order/redeem?token=' + token)}`);
    }
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default RedeemPage;
