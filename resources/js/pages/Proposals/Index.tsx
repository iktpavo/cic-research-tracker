// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { FolderOpen, Search } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { useState } from 'react';
import { route } from 'ziggy-js';
import ProposalFilters from '@/components/proposal/ProposalFilter';
import { ProposalFiltersData } from '@/types/filters';
import { formatCurrency } from '@/lib/utils';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Research Proposals & Monitoring',
        href: '/proposals',
    },
];


interface Proposal {
    id: number;
    program: string | null;
    research_title: string;
    start_date: string | null;
    duration: string | null;
    completion_percentage: number | null;
    year_completed: string | null;
    estimated_budget: number | null;
    budget_utilized: number | null;
    special_order: string | null;
    terminal_report: string | null;
}


interface PaginationData {
    current_page: number;
    data: Proposal[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    total: number;
}

interface PageProps {
    proposals: PaginationData;
    search?: string;
    programFilter?: string;
    yearFilter?: string;
    filters?: ProposalFiltersData;
}

export default function Index() {
    const { proposals, search: initialSearch, filters: initialFilters } = usePage().props as unknown as PageProps;

    const [searchTerm, setSearchTerm] = useState(initialSearch ?? '');
    const [filters, setFilters] = useState<ProposalFiltersData>({
        program: initialFilters?.program ?? 'any',
        year_completed: initialFilters?.year_completed ?? 'any',
        sort: initialFilters?.sort ?? 'default',
        search: initialFilters?.search ?? searchTerm,
    });
    const handleSearch = () => {
        router.get(route('proposals.index'), { ...filters, search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleApplyFilters = (appliedFilters: ProposalFiltersData) => {
        setFilters(appliedFilters);

        router.get(route('proposals.index'),
            {
                program: appliedFilters.program !== 'any' ? appliedFilters.program : undefined,
                year_completed: appliedFilters.year_completed !== 'any' ? appliedFilters.year_completed : undefined,
                sort: appliedFilters.sort,
                search: appliedFilters.search,
            },
            { preserveState: true, replace: true }
        );
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Research Proposals & Monitoring" />
            <div className='py-6 px-8'>
                <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Research Proposals & Monitoring</h1>
                </div>

                {/* Search */}
                <div className='flex gap-3 flex-row mb-4'>
                    <div className='flex flex-1 gap-2'>
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                className='pl-10 text-sm'
                                placeholder='Search Research Title / Agency / Funding...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />

                        </div>
                        <ProposalFilters
                            filters={filters}
                            setFilters={setFilters}
                            onFilter={handleApplyFilters}
                        />
                    </div>
                </div>

                {/* Table */}
                {proposals.data.length > 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-background overflow-hidden  animate-in fade-in slide-in-from-left-2 duration-300">
                        <Table>
                            <TableCaption>Research Proposals</TableCaption>
                            <TableHeader className="bg-gray-50 dark:bg-background h-15">
                                <TableRow>
                                    <TableHead>Program</TableHead>
                                    <TableHead >Research Title</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Completion %</TableHead>
                                    <TableHead>Year Completed</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Budget Utilized</TableHead>
                                    <TableHead>Special Order</TableHead>
                                    <TableHead>Terminal Report</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {proposals.data.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.program}</TableCell>
                                        <TableCell className="text-sidebar-accent-foreground w-[280px] whitespace-normal">{p.research_title}</TableCell>
                                        <TableCell>
                                            {p.start_date ? new Date(p.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                                        </TableCell>
                                        <TableCell>{p.duration ?? "-"}</TableCell>
                                        <TableCell>{p.completion_percentage !== null ? `${p.completion_percentage}%` : "-"}</TableCell>
                                        <TableCell>{p.year_completed ?? "-"}</TableCell>
                                        <TableCell>{formatCurrency(p.estimated_budget)}</TableCell>
                                        <TableCell>{formatCurrency(p.budget_utilized)}</TableCell>

                                        <TableCell>
                                            {p.special_order ? (
                                                <a href={`/storage/${p.special_order}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm">View File</a>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {p.terminal_report ? (
                                                <a href={`/storage/${p.terminal_report}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm">View File</a>
                                            ) : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="pb-4">
                            <Pagination links={proposals.links} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400">
                        No Proposals Found.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
