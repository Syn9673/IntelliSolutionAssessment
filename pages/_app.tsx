import type { AppProps } from "next/app";
import '@/styles/home.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;

  return (
    <>
      <Head>
        <title>URL Response Parser</title>
      </Head>

      <Component {...pageProps} />
    </>
  )
}
