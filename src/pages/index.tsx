import Landing from '@/screens/Landing/Landing'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>chatif.ai</title>
        <meta name="description" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Landing />
    </>
  )
}
