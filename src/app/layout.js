import './globals.css'

export const metadata = {
  title: 'Real Estate Letter Generator',
  description: 'Generate targeted real estate letters in minutes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 