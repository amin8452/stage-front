import { GetStaticProps } from 'next';
import Head from 'next/head';
import App from '../src/App';

interface HomeProps {
  siteUrl: string;
}

export default function Home({ siteUrl }: HomeProps) {
  return (
    <>
      <Head>
        <title>AI Portrait Pro - Portraits Prédictifs IA</title>
        <meta name="description" content="Générez votre portrait prédictif personnalisé avec l'intelligence artificielle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Portrait Pro - Portraits Prédictifs IA" />
        <meta property="og:description" content="Générez votre portrait prédictif personnalisé avec l'intelligence artificielle" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={siteUrl} />
      </Head>
      <App />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  };
};
