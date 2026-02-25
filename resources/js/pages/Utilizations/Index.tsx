import { Button } from '@/components/ui/button';
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
import { type BreadcrumbItem } from '@/types';
import { type Research } from '@/types/research';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FolderOpenDot, Pencil, Trash2, Search, BarChart3, Monitor, BookOpen, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/Pagination';
import UtilizationForm from '@/components/utilizations/UtilizationsForm';
import UtilizationFilters from '@/components/utilizations/UtilizationFilters';
import { UtilizationFiltersData } from '@/types/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Research Utilizations', href: '/utilizations' },
];

interface Utilization {
    id: number;
    research_id: number;
    research_title: string | null;
    beneficiary: string;
    cert_date: string;
    certificate_of_utilization: string;
    // analytics
    totalUtilizations: number;
    bsit: number;
    blis: number;
    bscs: number;
}

interface PaginationData {
    current_page: number;
    data: Utilization[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    total: number;
}

interface PageProps {
    utilizations: PaginationData;
    researches: Research[];
    search?: string;
    filters?: UtilizationFiltersData

    auth: {
        user: {
            id: number;
            name: string;
            role: 'admin' | 'user';
        }
    };
    totalUtilizations: number;
    programTotals: {
        bsit: number;
        blis: number;
        bscs: number;
    };
}

export default function Index() {
    const { utilizations, researches, search: initialSearch, filters: initialFilters, auth, totalUtilizations, programTotals } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role === 'admin';
    const { processing, delete: destroy } = useForm();

    const [utilList, setUtilList] = useState<Utilization[]>(utilizations.data);
    const [search, setSearch] = useState(initialSearch || '');
    const [filters, setFilters] = useState<UtilizationFiltersData>({
        search: initialFilters?.search || '',
        date_from: initialFilters?.date_from || '',
        date_to: initialFilters?.date_to || '',
        sort: 'default',
    });


    // dialogs
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUtilization, setSelectedUtilization] = useState<Utilization | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [utilToDelete, setUtilToDelete] = useState<Utilization | null>(null);

    useEffect(() => {
        setUtilList(utilizations.data);
    }, [utilizations.data]);

    const handleDeleteClick = (item: Utilization) => {
        setUtilToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (utilToDelete) {
            destroy(route('utilizations.destroy', utilToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setUtilToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (item: Utilization) => {
        setSelectedUtilization(item);
        setEditDialogOpen(true);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('utilizations.index'), { search }, { preserveState: true, replace: true });
    };

    const handleApplyFilters = (appliedFilters: UtilizationFiltersData) => {
        const payload: Record<string, string> = {
            search: appliedFilters.search || '',
            date_from: appliedFilters.date_from || '',
            date_to: appliedFilters.date_to || '',
            sort: appliedFilters.sort || 'default',
        };

        router.get(route('utilizations.index'), payload, {
            preserveState: true,
            replace: true,
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Utilizations" />
            <div className="py-6 px-8  animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-2">
                    <FolderOpenDot className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Research Utilizations</h1>

                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Key performance indicators and research trends.
                </p>
                {/*Analytics*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total  */}
                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Research Utilizations
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{totalUtilizations}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all programs
                            </p>
                        </CardContent>
                    </Card>

                    {/* BSIT  */}
                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                BSIT Program
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <Monitor className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{programTotals.bsit}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Information Technology
                            </p>
                        </CardContent>
                    </Card>

                    {/* BLIS */}
                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                BLIS Program
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{programTotals.blis}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Library Science
                            </p>
                        </CardContent>
                    </Card>

                    {/* BSCS  */}
                    <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-accent/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                BSCS Program
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter">{programTotals.bscs}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Computer Science
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-3 md:flex-row mb-4">
                    <div className="flex flex-1 gap-2">
                        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                className="pl-10"
                                placeholder="Search Research..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <UtilizationFilters
                            filters={filters}
                            setFilters={setFilters}
                            onFilter={handleApplyFilters}
                        />
                    </div>
                    {isAdmin && (
                        <div>
                            <Button onClick={() => setCreateDialogOpen(true)}>Add Utilization</Button>
                        </div>
                    )}
                </div>

                {utilList.length > 0 ? (
                    <div className='rounded-lg border border-gray-200 bg-background overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300'>
                        <Table>
                            <TableCaption>Utilization Records</TableCaption>
                            <TableHeader className='bg-gray-50 dark:bg-background h-15'>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Research Title</TableHead>
                                    <TableHead>Beneficiary</TableHead>
                                    <TableHead>Certificate Date</TableHead>
                                    <TableHead>Certificate File</TableHead>
                                    {isAdmin && (
                                        <TableHead className="text-center">Action</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {utilList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell className="text-sidebar-accent-foreground">{item.research_title}</TableCell>
                                        <TableCell>{item.beneficiary}</TableCell>
                                        <TableCell>{item.cert_date}</TableCell>
                                        <TableCell>
                                            {item.certificate_of_utilization ? (
                                                <a
                                                    href={`/storage/${item.certificate_of_utilization}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    View Certificate
                                                </a>
                                            ) : 'No file'}
                                        </TableCell>
                                        {isAdmin && (<>
                                            <TableCell className="space-x-2 text-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            className='text-sidebar-accent-foreground'
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Edit</p></TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600"
                                                            disabled={processing}
                                                            onClick={() => handleDeleteClick(item)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Delete</p></TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="pb-2">
                            <Pagination links={utilizations.links} />
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                        No Utilization Records Found.
                    </div>
                )}
            </div>

            {/* CREATE */}
            <UtilizationForm
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                researches={researches}
            />

            {/* EDIT */}
            <UtilizationForm
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                utilization={selectedUtilization || undefined}
                researches={researches}
            />

            {/* DELETE */}
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Record"
                message={`Are you sure you want to delete this utilization record?`}
                loading={processing}
            />
        </AppLayout>
    );
}
