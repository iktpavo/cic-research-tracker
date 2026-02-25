import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Research, Member } from '@/types/research';
import { Card } from '@/components/ui/card';
import {
    User,
    Users,
    Calendar,
    Wallet,
    FileText,
    BadgeCheck,
    Building2,
    Layers,
    BookOpen,
    ShieldCheck,
    Package,
    Users2,
    MapPinned,
    ScrollText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PageProps {
    research: Research & { members: Member[] };
    [key: string]: unknown;
}

export default function Show() {
    const { research } = usePage<PageProps>().props;
    const memberCount = research.members.length;

    return (
        <AppLayout breadcrumbs={[{ title: 'Research / View', href: '/research' }]}>
            <Head title="View Research" />

            <Card className="m-4 mb-0 pt-3 pb-5 animate-in fade-in slide-in-from-bottom-4 duration-500 gap-1.5">
                <div className="flex items-center gap-2 text-sm text-primary px-4">
                    <Link href="/research" className="hover:underline font-medium">
                        Research Index
                    </Link>
                    <span>/</span>
                    <p>View Research</p>
                </div>
                <h1 className="px-4 mt-2 text-2xl font-semibold tracking-tight">
                    {research.research_title}
                </h1>
            </Card>

            <div className="p-4 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex-1 space-y-4">
                    <Card className="rounded-lg px-6 pb-6 gap-4.5">
                        <h2 className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 text-xl font-semibold pb-2">
                            <Layers className="h-5 w-5 text-primary" />
                            Research Details
                        </h2>

                        <div className="mt-3 text-xs space-y-1">
                            {[
                                { label: 'Research Duration', value: research.duration || 'N/A', icon: Calendar },
                                { label: 'Source of Funding', value: research.funding_source || 'N/A', icon: Wallet },
                                { label: 'Collaborating Agency', value: research.collaborating_agency || 'N/A', icon: Building2 },
                                { label: 'Type of Research', value: research.type, icon: BadgeCheck },
                                { label: 'Status', value: research.status, icon: BadgeCheck },
                                { label: 'Program', value: research.program, icon: Layers },
                                {
                                    label: 'Start Date',
                                    value: research.start_date
                                        ? new Date(research.start_date).toLocaleDateString()
                                        : 'N/A',
                                    icon: Calendar,
                                },
                                { label: 'Estimated Budget', value: formatCurrency(research.estimated_budget), icon: Wallet },
                                { label: 'Budget Utilized', value: formatCurrency(research.budget_utilized), icon: Wallet },
                                {
                                    label: 'Completion Percentage',
                                    value: research.completion_percentage ?? 'N/A',
                                    icon: BadgeCheck,
                                },
                                { label: 'Year Completed', value: research.year_completed || 'N/A', icon: Calendar },
                            ].map((item, index) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center justify-between rounded-md px-3 py-2 transition-all duration-200
                                    ${index % 2 === 0
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : 'bg-white dark:bg-gray-700'
                                        }
                                    hover:bg-gray-200 dark:hover:bg-gray-600`}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4 text-primary" />
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-lg px-6 py-3 gap-1.5">
                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-primary" />
                            Terminal Report
                        </h3>
                        {research.terminal_report ? (
                            <a
                                href={`/storage/${research.terminal_report}`}
                                target="_blank"
                                className="mt-1 inline-block text-xs underline text-sidebar-accent-foreground"
                            >
                                View File
                            </a>
                        ) : (
                            <p className="text-xs text-primary mt-1">No file available</p>
                        )}
                    </Card>

                    <Card className="rounded-lg px-6 py-3">
                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-primary" />
                            Special Order
                        </h3>
                        {research.special_order ? (
                            <a
                                href={`/storage/${research.special_order}`}
                                target="_blank"
                                className="mt-1 inline-block text-xs underline text-sidebar-accent-foreground"
                            >
                                View File
                            </a>
                        ) : (
                            <p className="text-xs text-primary mt-1">No file available</p>
                        )}
                    </Card>
                </div>

                <div className="flex-1">
                    <Card className="rounded-lg px-6 pb-4 gap-1.5">
                        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                            <h2 className="flex items-center gap-2 text-xl font-semibold">
                                <Users className="h-5 w-5 text-primary" />
                                Research Members
                            </h2>
                            <span className="text-xs font-medium text-primary">
                                {memberCount} Members
                            </span>
                        </div>

                        {memberCount === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">No members assigned.</p>
                        ) : (
                            <div className="mt-4 grid gap-y-5 gap-x-3 xl:grid-cols-2">
                                {research.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 rounded-md p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        {member.profile_photo ? (
                                            <img
                                                src={`/storage/${member.profile_photo}`}
                                                alt={member.full_name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                        )}

                                        <div className="leading-tight">
                                            <p className="text-sm font-medium">{member.full_name}</p>
                                            <p className="text-xs font-medium text-gray-500">
                                                {member.rank} | {member.member_program}
                                            </p>
                                            {member.member_email && (
                                                <p className="text-xs text-gray-500">
                                                    {member.member_email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <div className="mt-12">
                <div className="flex justify-center pt-6 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4">
                        <img className="h-11 w-11" src="/dost.png" alt="" />
                        <h1 className="text-3xl font-bold tracking-widest text-gray-800 uppercase">
                            DOST6PS
                        </h1>
                    </div>
                </div>

                <p className="text-sm text-gray-500 text-center mb-8">
                    Key Performance Indicators
                </p>

                <Card className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4">
                    {[
                        {
                            title: 'Publication',
                            value: research.publication,
                            icon: BookOpen,
                        },
                        {
                            title: 'Patent',
                            value: research.patent,
                            icon: ShieldCheck,
                        },
                        {
                            title: 'Product',
                            value: research.product,
                            icon: Package,
                        },
                        {
                            title: 'People Services',
                            value: research.people_service,
                            icon: Users2,
                        },
                        {
                            title: 'Place and Partnerships',
                            value: research.place_and_partnership,
                            icon: MapPinned,
                        },
                        {
                            title: 'Policies',
                            value: research.policy,
                            icon: ScrollText,
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group p-6 border border-gray-300 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.title}
                                </h3>
                            </div>

                            <p className="text-sm text-primary border-l pl-4 leading-relaxed">
                                {item.value ? (item.value) :
                                    (
                                        <span className="italic text-gray-400">
                                            No {item.title} Description Provided
                                        </span>
                                    )}
                            </p>
                        </div>
                    ))}
                </Card>
            </div>
        </AppLayout>
    );
}
