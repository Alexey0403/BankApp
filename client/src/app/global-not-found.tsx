import './globals.css'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/components/auth/AuthContext'
 
const inter = Inter({ subsets: ['latin'] })
 
export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.className}>
            
            <body className='min-h-screen flex flex-col'>
                <AuthProvider>
                    <Header hideNavMenu />
                    <div className='flex-1 flex flex-col items-center justify-center'>
                        <Image
                            src="/images/logo.webp"
                            width={400}
                            height={160}
                            alt="Logo"
                            className='mb-10'
                        />
                        <h1 className="text-[32px]/[120%] font-medium mb-4">404 - Page Not Found</h1>
                        <p className='mb-4'>We can't find the page you're looking for</p>
                        <a
                            href="/"
                            className='text-white bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] p-2 rounded-md translation-colors hover:text-gray-100'
                        >
                            Return Home
                        </a>
                    </div>
                    <Footer hideNavMenu />
                </AuthProvider>
            </body>
        </html>
    )
};