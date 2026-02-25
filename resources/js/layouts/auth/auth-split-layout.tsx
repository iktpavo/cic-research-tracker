import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const images = [
    "/login-img1.jpg",
    "/login-img2.jpg",
    "/login-img3.jpg"
];

export default function AuthSplitLayout({
    children,
}: PropsWithChildren<AuthLayoutProps>) {
    const [current, setCurrent] = useState(0);

    // this is for slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative grid min-h-screen bg-[#f1f1f1] flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* LEFT SPLIT with slideshow background */}
            <div
                className="relative hidden h-full flex-col bg-cover bg-center lg:flex dark:border-r transition-all duration-1000"
                style={{ backgroundImage: `url(${images[current]})` }}>

                

                {/* for quotes below, supposedly changing unta */}
                <div className="relative z-20 mt-auto p-10">
                    <blockquote className="space-y-2">
                        <p className="text-lg italic text-white">&ldquo;We Build Dreams Without Limits&rdquo;</p>
                        <footer className="text-sm text-neutral-300">
                            USeP - College of Information and Computing
                        </footer>
                    </blockquote>
                </div>
            </div>
            
            {/* For the RIGHT SPLIT with form */}
            <div className="w-full lg:p-8">
                <Card className="flex flex-col mx-auto w-full max-w-sm justify-center px-7 sm:px-10 shadow-2xl dark:bg-black">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center">
                        <div className="w-auto">
                            <img src="/ciclogo.png" alt="CIC Logo" className="w-auto h-25" />
                        </div>
                    </Link>
                    {children}
                </Card>
            </div>
        </div>
    );
}
