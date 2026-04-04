import './globals.css'

export const metadata = {
  title: 'Ainal.fun | The Analogy Game',
  description: 'Type a concept. Get three analogies instantly.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Ainal.fun | The Analogy Game',
    description: 'Type a concept. Get three analogies instantly.',
    url: 'https://ainal.fun',
    siteName: 'Ainal.fun',
    images: [
      {
        url: 'https://ainal.fun/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ainal.fun - The Analogy Game',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ainal.fun | The Analogy Game',
    description: 'Type a concept. Get three analogies instantly.',
    images: ['https://ainal.fun/logo.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
