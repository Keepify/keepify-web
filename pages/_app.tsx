import { useEffect, useLayoutEffect } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import ReactNotification from 'react-notifications-component';
import { createWrapper } from 'next-redux-wrapper';
import { useUserInfo } from 'hooks/redux';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import setAuthToken from 'helpers/token';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import { getUser } from 'services/user';
import { setUserInfo } from 'actions/user';
import { initializeStore } from 'store';
import 'styles/tailwind.css';
import 'nprogress/nprogress.css';
import 'styles/nprogress.css';
import 'react-notifications-component/dist/theme.css';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const { isLogin } = useUserInfo();

  useLayoutEffect(() => {
    if (isLogin) {
      // bind token to axios header
      const token = cookie.get('_ap.ut');
      setAuthToken(token);
    }
  }, []);

  return (
    <>
      <ReactNotification />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContextType) => {
  const cookies = nextCookie(ctx);

  if (ctx.req) {
    // Validate user ID and user token from cookies (if they exist) & retrieve profile info
    if (cookies['_ap.ut']) {
      try {
        // set JWT token to axios header
        setAuthToken(cookies['_ap.ut']);

        const user = await getUser();
        ctx.store.dispatch(setUserInfo(user));
      } catch (e) {
        // Clear cookie
        cookie.remove('_ap.ut');
      }
    }
  }

  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { pageProps };
};

const wrapper = createWrapper(initializeStore);

export default wrapper.withRedux(MyApp);
