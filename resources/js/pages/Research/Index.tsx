import ResearchForm from '@/components/research/ResearchForm';
import { Button } from '@/components/ui/button';
//import { Card } from '@/components/ui/card';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Member, type Research } from '@/types/research';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { BookText, Eye, Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import ResearchFilters from '@/components/research/ResearchFilters';
import { ResearchFilterData } from '@/types/filters';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/Pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Research',
        href: '/research',
    },
];



const statusBadgeStyles = {
    ongoing: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    terminated: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
} as const;


interface PaginationData {
    current_page: number;
    data: Research[];
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface PageProps {
    research: PaginationData;
    members: Member[];
    auth: {
        user: {
            id: number;
            name: string;
            role: 'admin' | 'user';
        }
    };
}

export default function Index() {
    const { research, members, auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role === 'admin';
    const [researchList, setResearchList] = useState<Research[]>(research.data);
    const { processing, delete: destroy } = useForm();
    // states for controllign add and edit form
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);
    // states for controlling delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [researchToDelete, setResearchToDelete] = useState<Research | null>(null);

    const [filters, setFilters] = useState<ResearchFilterData>({
        type: 'any',
        status: '',
        year_completed: '',
        program: 'any',
    });

    useEffect(() => {
        setResearchList(research.data);
    }, [research.data]);

    const handleFilterChange = (newFilters: ResearchFilterData) => {
        setFilters(newFilters);

        router.get(route('research.index'), {
            type: newFilters.type,
            status: newFilters.status,
            year_completed: newFilters.year_completed,
            program: newFilters.program,
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDeleteClick = (researchItem: Research) => {
        setResearchToDelete(researchItem);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (researchToDelete) {
            destroy(route('research.destroy', researchToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setResearchToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (researchItem: Research) => {
        setSelectedResearch(researchItem);
        setEditDialogOpen(true);
    };

    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Research" />
            <div className='py-6 px-8'>
                <div className=" flex items-center gap-2 mb-2">
                    <BookText className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Research </h1>
                </div>
                <div className='flex flex-col gap-3 md:flex-row mb-4'>
                    <div className='flex flex-1 gap-2'>
                        <div className="relative w-full max-w-lg ">
                            <Search className=" absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                className="pl-10"
                                placeholder="Search Research Title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.get(route('research.index'), { search: searchTerm, ...filters }, { preserveState: true, preserveScroll: true });
                                    }
                                }}
                            />

                        </div>
                        <ResearchFilters
                            filters={filters}
                            setFilters={setFilters}
                            onFilter={handleFilterChange}
                        />
                    </div>
                    {isAdmin && (
                        <div >
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                Add Research
                            </Button>
                        </div>
                    )}
                </div>

                {researchList.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-background overflow-hidden slide-in-from-left-2 duration-300 animate-in fade-in">
                        <Table>
                            <TableCaption>Research List</TableCaption>
                            <TableHeader className='bg-gray-50 dark:bg-background h-15'>
                                <TableRow>
                                    <TableHead className="text-gray-500 dark:text-primary w-[60px]">ID</TableHead>
                                    <TableHead className="text-gray-500 dark:text-primary w-[280px]">Research Title</TableHead>
                                    <TableHead className="text-gray-500 dark:text-primary w-[180px]">Funding Source</TableHead>
                                    <TableHead className="text-gray-500 dark:text-primary w-[180px]">Collaborating Agency</TableHead>
                                    <TableHead className="text-gray-500 dark:text-primary w-[140px]">Research Type</TableHead>
                                    <TableHead className="text-gray-500 dark:text-primary w-[120px] pl-6">Status</TableHead>
                                    <TableHead className="text-center dark:text-primary text-gray-500 w-[140px]">Action</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody className='bg-background'>
                                {researchList.map((research) => (
                                    <TableRow key={research.id}>
                                        <TableCell className="w-[60px]">
                                            {research.id}
                                        </TableCell>
                                        <TableCell className="text-sidebar-accent-foreground w-[280px] whitespace-normal">
                                            {research.research_title}
                                        </TableCell>
                                        <TableCell className='w-[180px] whitespace-normal'>
                                            {research.funding_source}
                                        </TableCell>
                                        <TableCell className='w-[180px] whitespace-normal'>
                                            {research.collaborating_agency}
                                        </TableCell>
                                        <TableCell className='capitalize w-[140px]'>{research.type}</TableCell>
                                        <TableCell className="w-[120px]">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
                                                    statusBadgeStyles[research.status as keyof typeof statusBadgeStyles] ||
                                                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                                )}
                                            >
                                                {research.status}
                                            </span>
                                        </TableCell>

                                        <TableCell className="space-x-2 text-center w-[140px]">
                                            {/*view research route*/}
                                            <Link href={route('research.show', research.id)}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-6 text-green-600 hover:bg-green-50 hover:text-green-600">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Link>

                                            {/*edit route*/}
                                            {isAdmin && (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-6 text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        research,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {/*handling delete*/}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-6 text-red-500 hover:bg-red-50 hover:text-red-500  "
                                                                disabled={processing}
                                                                onClick={() => handleDeleteClick(research)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Pagination Component */}
                        <div className="pb-4">
                            <Pagination links={research.links} />
                        </div>
                    </div>
                )}
                {researchList.length == 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400">
                        No Researches Found.
                    </div>
                )}
            </div>


            {/* Create Research Dialog */}
            <ResearchForm
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                members={members}
            />

            {/* Edit Research Dialog */}
            <ResearchForm
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                research={selectedResearch || undefined}
                members={members}
            />

            {/* Delete Research Dialog */}
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Research"
                message={`Are you sure you want to delete "${researchToDelete?.research_title}"? This action cannot be undone.`}
                loading={processing}
            />
        </AppLayout>
    );
};