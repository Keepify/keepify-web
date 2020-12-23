import App from 'next/app';
import NProgress from 'nprogress';
import Router from 'next/router';
import ReactNotification from 'react-notifications-component';
import 'styles/tailwind.css';
import 'nprogress/nprogress.css';
import 'styles/nprogress.css';
import 'react-notifications-component/dist/theme.css';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ReactNotification />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return appProps;
};

export default MyApp;
