"use client"
import WebcamCapture from '@/components/webcamCapture';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Webcam Capture</title>
        <meta name="description" content="Webcam Capture with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Webcam Capture</h1>
        <WebcamCapture />
      </main>

      <footer>
        <p>Powered by Next.js</p>
      </footer>
    </div>
  );
};

export default Home;
