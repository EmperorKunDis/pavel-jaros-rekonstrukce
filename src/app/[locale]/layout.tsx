import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../global.css";
import ClientBody from "../ClientBody";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import {notFound} from 'next/navigation';
import {ErrorBoundary} from '../../components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;

  const title = "PJ Rekonstrukce - Kompletní rekonstrukce bytů a domů | Pavel Jaroš";
  const description = "Provádíme kompletní rekonstrukce bytů a domů v Karlovarském kraji. Od prvotního návrhu až po finální úklid – spolehlivě, kvalitně a v termínu.";

  return {
    title,
    description,
    keywords: ['rekonstrukce bytů', 'rekonstrukce domů', 'bytové jádro', 'Karlovarský kraj', 'stavební firma', 'Pavel Jaroš', 'rekonstrukce', 'přestavba'],
    authors: [{name: 'Pavel Jaroš'}],
    creator: 'Pavel Jaroš',
    publisher: 'PJ Rekonstrukce',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://pjreko.cz'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'cs': '/cs',
        'en': '/en',
        'de': '/de',
        'pl': '/pl',
        'sk': '/sk',
        'ru': '/ru',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://pjreko.cz/${locale}`,
      siteName: 'PJ Rekonstrukce',
      images: [
        {
          url: '/images/PajaBezPrdeleReko.png',
          width: 1200,
          height: 630,
          alt: 'PJ Rekonstrukce - Pavel Jaroš',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/PajaBezPrdeleReko.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const dynamic = 'force-static';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PJ Rekonstrukce - Pavel Jaroš",
    "image": "/images/PajaBezPrdeleReko.png",
    "telephone": "+420 777 558 730",
    "email": "pavel.jaros@kwcz.cz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kaprova 52/6",
      "addressLocality": "Praha 1",
      "addressCountry": "CZ"
    },
    "url": `https://pjreko.cz/${locale}`,
    "logo": "/logo/PJRekoLogo.png",
    "description": "Provádíme kompletní rekonstrukce bytů a domů v Karlovarském kraji. Od prvotního návrhu až po finální úklid.",
    "priceRange": "$$",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Karlovarský kraj"
    },
    "knowsAbout": ["Rekonstrukce bytů", "Rekonstrukce domů", "Bytová jádra", "Řemeslné práce"],
    "taxID": "10846671"
  };

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <ClientBody>{children}</ClientBody>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
