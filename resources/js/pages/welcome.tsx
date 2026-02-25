import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { ListTodo, FolderOpen, ChartNoAxesCombined, Users, Eye, Server } from 'lucide-react';
import DarkVeil from '@/components/DarkVeil';
import Stack from '@/components/Stack';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const images = [
        '/welcome-img2.jpg',
        '/welcome-img3.jpg',
        '/welcome-img4.jpg',
        '/welcome-img5.jpg',
        '/welcome-img-6.png',
        '/welcome-img-8.png',
        '/welcome-img-7.png',
    ];

    return (
        <>
            <Head title="CIC Research Tracker" />

            <div className="min-h-screen flex flex-col text-slate-900 font-sans bg-slate-50/50 selection:bg-black selection:text-white">

                <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
                    <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">

                        <div className="flex items-center gap-3 w-[240px]">
                            <img src="/ciclogo.png" alt="CIC Logo" className="w-9 h-9 object-contain" />
                            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                                CIC Research
                            </span>
                        </div>

                        <div className="hidden md:flex flex-1 justify-center items-center gap-1">
                            {['Home', 'Core Features', 'About Us'].map((item, i) => {
                                const ids = ['#research', '#features', '#about'];
                                return (
                                    <Link key={item} href={ids[i]}>
                                        <Button
                                            variant="ghost"
                                            className="text-sm font-medium text-slate-600 hover:text-black hover:bg-slate-100/80 px-5 rounded-full transition-all duration-300"
                                        >
                                            {item}
                                        </Button>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="flex items-center justify-end gap-3 w-[240px]">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button className=" cursor-pointer bg-slate-900 text-white text-xs hover:bg-slate-800 font-medium px-6 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="outline" className="cursor-pointer text-sm font-medium hover:bg-gray-50 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 px-4">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button className=" cursor-pointer bg-slate-900 text-white text-xs hover:bg-slate-800 font-medium px-6 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <section id="research" className="w-full max-w-[1400px] mx-auto px-6 pt-24 pb-32 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="space-y-8 max-w-4xl relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-100/50 blur-[100px] -z-10 rounded-full mix-blend-multiply" />
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">System Online v1.0</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900 text-balance">
                            Research Tracking <br className="hidden md:block" /> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-black">Monitoring System</span>
                        </h1>

                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-balance max-w-2xl mx-auto">
                            A centralized platform designed to streamline research management across
                            the College of Information and Computing—making progress tracking,
                            collaboration, and documentation easier than ever.
                        </p>

                        <div className="pt-4 flex justify-center gap-4">
                            <Link href="#features">
                                <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 h-12">
                                    Explore Features
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="w-full px-6">
                    <div className="max-w-[1400px] mx-auto h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>

                <section id="features" className="w-full max-w-[1400px] mx-auto px-6 py-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Core Features</h2>
                            <div className="h-1 w-20 bg-black rounded-full"></div>
                        </div>
                        <p className="text-slate-500 max-w-md text-right hidden md:block leading-relaxed">
                            Built with precision to handle the complex lifecycle of academic research from proposal to publication.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[
                            { icon: ListTodo, title: "Project Management", desc: "Create research projects, divide them into phases, assign members, and track deadlines." },
                            { icon: FolderOpen, title: "Document Repository", desc: "Upload, store, and manage research documents with strictly handled version control." },
                            { icon: ChartNoAxesCombined, title: "Analytics Dashboard", desc: "Monitor milestones and view real-time updates through an intuitive analytics dashboard." },
                            { icon: Users, title: "Enhanced Collaboration", desc: "Improve communication with centralized updates, comments, and structured task assignments." },
                            { icon: Eye, title: "Transparency", desc: "Identify delays early with clear visibility into individual responsibilities and timelines." },
                            { icon: Server, title: "Scalable Architecture", desc: "Built specifically for CIC but flexible enough for expansion across other university departments." },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col gap-6">
                                    {/* Icon Box */}
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-black flex items-center justify-center transition-colors duration-300">
                                        <feature.icon className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors duration-300" />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                                        <p className="text-slate-500 leading-relaxed text-sm group-hover:text-slate-600 transition-colors">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="about" className="w-full py-32 bg-white border-y border-slate-100">
                    <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-8 animate-in slide-in-from-left-8 duration-700 fade-in">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                                About The Research Tracker
                            </h2>

                            <div className="space-y-6 text-slate-600 leading-8 text-lg">
                                <p>
                                    Research plays a vital role at the University of Southeastern Philippines,
                                    especially within the College of Information and Computing (CIC). Monitoring
                                    progress, coordinating roles, and managing documentation have become increasingly
                                    challenging.
                                </p>
                                <p>
                                    The CIC Research Tracker centralizes research management for faculty, students,
                                    and staff, with milestones, task assignments, and real-time
                                    updates.
                                </p>
                                <p>
                                    Built for scalability, the system can expand across other departments—paving
                                    the way for a unified, university-wide research management solution.
                                </p>
                            </div>

                            <Button variant="outline" className="mt-4 rounded-full px-8 border-slate-300 hover:bg-slate-50 hover:text-black">
                                <a href="https://www.usep.edu.ph/ic/" target='_blank' rel="noopener noreferrer">Learn More About CIC</a>
                            </Button>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end w-full animate-in slide-in-from-right-8 duration-700 fade-in delay-200">
                            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                                <div className="scale-75 sm:scale-90 md:scale-100 transition-transform hover:scale-105 duration-500 cursor-pointer">
                                    <div style={{ width: 500, height: 500, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', borderRadius: '24px', background: 'white' }}>
                                        <Stack
                                            randomRotation={true}
                                            sensitivity={150}
                                            sendToBackOnClick={true}
                                            cards={images.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt={`Research highlight ${i + 1}`}
                                                    className="w-full h-full object-cover rounded-[24px] border border-gray-100"
                                                />
                                            ))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-50 py-20 border-b border-slate-200">
                    <div className="max-w-[1400px] mx-auto px-6 text-center">
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 mb-10">
                            {[
                                { src: "/usep_logo.png", alt: "USEP" },
                                { src: "/bagong_pilipinas_logo.png", alt: "Bagong Pilipinas" },
                                { src: "/pqa_logo.png", alt: "PQA" },
                                { src: "/iso_9001_logo.png", alt: "ISO 9001" },
                            ].map((logo, idx) => (
                                <div key={idx} className="group relative">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-16 md:h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 ease-out"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-semibold tracking-widest text-gray-600 uppercase">
                            "We Build Dreams Without Limits"
                        </p>
                    </div>
                </section>

                <section className="relative py-24 bg-slate-950 text-white overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-30">
                        <DarkVeil />
                    </div>

                    <div className="relative z-10 max-w-[1400px] mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 text-left">

                            {[
                                {
                                    title: "USeP VISION",
                                    content: "Premier research university transforming communities in the ASEAN and beyond."
                                },
                                {
                                    title: "USeP MISSION",
                                    content: "USeP shall contribute to inclusive growth and sustainable development through continual innovation in proactive academic programs, impactful research for utilization, economically empowering community services, and sustainable resource management."
                                },
                                {
                                    title: "USeP Goals",
                                    list: [
                                        "Internationalized University programs and services.",
                                        "Innovation and RDE-nurturing environment.",
                                        "Proactive, globally competitive, and service-oriented graduates.",
                                        "Transformed vulnerable and disadvantaged groups.",
                                        "Mobilized and optimized resources."
                                    ]
                                },
                                {
                                    title: "Core Values",
                                    list: ["Collaboration", "Accountability", "Resilience", "Excellence", "Service Oriented"]
                                },
                                {
                                    title: "Core Competency",
                                    content: "Inclusive and innovative quality education for community transformation."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-l-2 border-yellow-500 pl-3">
                                        {item.title}
                                    </h3>

                                    {item.list ? (
                                        <ul className="text-slate-300 text-sm space-y-3 leading-relaxed">
                                            {item.list.map((li, lIdx) => <li key={lIdx} className="hover:text-white transition-colors cursor-default">• {li}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-300 text-sm leading-relaxed hover:text-white transition-colors cursor-default">
                                            {item.content}
                                        </p>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-white border-t border-slate-200">
                    <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <img src="/ciclogo.png" alt="CIC" className="w-8 h-8 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800">College of Information and Computing</span>
                                <span className="text-xs text-slate-500">University of Southeastern Philippines</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex gap-6">
                                <Link href="#" className="text-xs font-medium text-slate-500 hover:text-black transition-colors">Privacy Policy</Link>
                                <Link href="#" className="text-xs font-medium text-slate-500 hover:text-black transition-colors">Terms of Service</Link>
                            </div>
                            <div className="text-xs text-slate-400">© 2025 CIC Research Tracker</div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}