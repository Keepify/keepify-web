import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:type" content="website" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Sen:400,700,800&display=swap"
          />
        </Head>
        <body className="font-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
