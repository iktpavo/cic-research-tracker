import PublicationForm from '@/components/publication/PublicationForm';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Publication } from '@/types/publication';
import { Member } from '@/types/research';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { BookOpenCheck, ExternalLink, Link, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import Pagination from '@/components/ui/Pagination';
import PublicationFilters from '@/components/publication/PublicationFilters';
import { PublicationFiltersData } from '@/types/filters';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CIC Research Publications', href: '/publications' },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface PageProps {
    publications: PaginationData<Publication>;
    members: Member[];
    filters: PublicationFiltersData;
    auth: {
        user: {
            id: number;
            name: string;
            role: 'admin' | 'user';
        }
    };
}

export default function Index() {
    const { publications, members, filters: initialFilters, auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role === 'admin';
    const { processing, delete: destroy } = useForm();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState<PublicationFiltersData>({
        search: initialFilters?.search || '',
        publication_program: initialFilters?.publication_program || 'any',
        year_from: initialFilters?.year_from || '',
        year_to: initialFilters?.year_to || '',
        sort: initialFilters?.sort || 'default',
    });

    const handleFilterChange = (updatedFilters: PublicationFiltersData) => {
        setFilters(updatedFilters);
        router.get(route('publications.index'), updatedFilters as Record<string, | null>, {    //,any to | null
            preserveState: true,
            replace: true,
        });
    };

    const handleEditClick = (publication: Publication) => {
        setSelectedPublication(publication);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (publication: Publication) => {
        setPublicationToDelete(publication);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (publicationToDelete) {
            destroy(route('publications.destroy', publicationToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setPublicationToDelete(null);
                },
            });
        }
    };

    const formatAuthorName = (full_name: string): string => {
        const parts = full_name.trim().split(' ');
        if (parts.length <= 1) return full_name;
        return `${parts[0].charAt(0).toUpperCase()}. ${parts.slice(1).join(' ')}`;
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('publications.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    return (
        <TooltipProvider delayDuration={300}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="CIC Research Publications" />
                <div className="px-8 py-6">
                    <div className="mb-2 flex items-center gap-2">
                        <BookOpenCheck className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">CIC Research Publications</h1>
                    </div>

                    {/* Search and Add */}
                    <div className='flex flex-col gap-3 md:flex-row mb-4'>
                        <div className="flex flex-1 gap-2">
                            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    className="pl-10 text-sm"
                                    placeholder="Search Research Publication..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                            <PublicationFilters
                                filters={filters}
                                setFilters={setFilters}
                                onFilter={handleFilterChange}
                            />
                        </div>
                        {isAdmin && (
                            <div>
                                <Button onClick={() => setCreateDialogOpen(true)}>Add Publication</Button>
                            </div>
                        )}

                    </div>

                    {/* Publications List, added animation*/}
                    <div className="rounded-sm border bg-white animate-in fade-in slide-in-from-left-2 duration-300">
                        {publications.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                                No Publications Found.
                            </div>
                        ) : (
                            publications.data.map((publication) => (
                                <div
                                    key={publication.id}
                                    className="flex flex-col gap-2.5 border-b border-gray-200 p-5 transition-colors last:border-0 bg-background hover:bg-muted"
                                >
                                    {/* Title & Actions */}
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-primary max-w-190 font-semibold text-lg leading-tight">
                                            {publication.publication_title}
                                        </h3>
                                        {isAdmin && (
                                            <div className="ml-2 flex shrink-0 items-center space-x-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-6 text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                            onClick={() => handleEditClick(publication)}
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
                                                            className="h-8 w-6 text-red-600 hover:bg-red-50 hover:text-red-600"
                                                            disabled={processing}
                                                            onClick={() => handleDeleteClick(publication)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Delete</p></TooltipContent>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>

                                    {/* Authors */}
                                    <div className="w-full max-w-3xl">
                                        <p
                                            className="truncate text-sm text-gray-600 dark:text-gray-400"
                                            title={publication.members?.map((m) => m.full_name).join(', ')}
                                        >
                                            {publication.members?.length
                                                ? publication.members.map((m) => formatAuthorName(m.full_name)).join(', ')
                                                : 'No authors listed'}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{publication.journal}</span>
                                        <span className="text-gray-300 dark:text-gray-400">|</span>
                                        <span>{publication.publication_program}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{publication.publisher}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{publication.publication_year}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-1 flex flex-wrap items-center justify-between gap-4 pt-2">
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                            {publication.isbn && <span>ISBN: <span className="text-gray-600 dark:text-gray-400">{publication.isbn}</span></span>}
                                            {publication['p-issn'] && <span>P-ISSN: <span className="text-gray-600 dark:text-gray-400">{publication['p-issn']}</span></span>}
                                            {publication['e-issn'] && <span>E-ISSN: <span className="text-gray-600 dark:text-gray-400">{publication['e-issn']}</span></span>}
                                            {/* incentive_file */}
                                            {publication.incentive_file ? (
                                                <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                                                    <Link className="h-3 w-3" />
                                                    <a href={`/storage/${publication.incentive_file}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-grey-800 hover:underline text-xs">Incentive Certificate</a>
                                                </div>
                                            ) : ""}
                                            {/*product_file*/}
                                            {publication.product_file ? (
                                                <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                                                    <Link className="h-3 w-3" />
                                                    <a href={`/storage/${publication.product_file}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-grey-800 hover:underline text-xs">Product Certificate</a>
                                                </div>
                                            ) : ""}
                                            {/*patent_file*/}
                                            {publication.patent_file ? (
                                                <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                                                    <Link className="h-3 w-3" />
                                                    <a href={`/storage/${publication.patent_file}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-grey-800 hover:underline text-xs">Patent Certificate</a>
                                                </div>
                                            ) : ""}
                                        </div>
                                        {/*online view source */}
                                        <a
                                            href={publication.online_view}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Online View Source
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="pb-2">
                        <Pagination links={publications.links} />
                    </div>
                </div>

                {/* Dialogs */}
                <PublicationForm
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    members={members}
                />
                <PublicationForm
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    publication={selectedPublication || undefined}
                    members={members}
                />
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleConfirmDelete}
                    title="Delete Publication"
                    message={`Are you sure you want to delete "${publicationToDelete?.publication_title}"? This action cannot be undone.`}
                    loading={processing}
                />
            </AppLayout>
        </TooltipProvider >
    );
}
