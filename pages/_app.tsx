import App from 'next/app';
import NProgress from 'nprogress';
import Router from 'next/router';
import 'styles/tailwind.css';
import 'nprogress/nprogress.css';
import 'styles/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return appProps;
};

export default MyApp;
