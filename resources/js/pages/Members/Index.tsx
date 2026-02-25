import React, { useState, } from "react"; // useEffect import here
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from '@/components/ui/button';
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { type Member } from '@/types/research';
import MemberForm from "@/components/member/MemberForm";
import { route } from "ziggy-js";
import { Search, Users } from "lucide-react";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import MemberFilters from '@/components/member/MemberFilters';
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import { MemberFilterData } from "@/types/filters";
import MemberCard from "@/components/member/MemberCard";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Research Members / Faculty & Staff', href: '/members' },
];

interface PaginationData {
    current_page: number;
    data: Member[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    total: number;
}

interface PageProps {
    members: PaginationData;
    filters: MemberFilterData & { search?: string };
    auth: {
        user: {
            id: number;
            name: string;
            role: 'admin' | 'user';
        }
    };
}

export default function Index() {
    const { members, filters: initialFilters, auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role === 'admin';
    const { processing, delete: destroy } = useForm();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

    const [search, setSearch] = useState(initialFilters.search || '');
    const [filters, setFilters] = useState<MemberFilterData>({
        rank: initialFilters.rank || 'any',
        member_program: initialFilters.member_program || 'any',
        sort: initialFilters.sort || 'default',
    });

    const handleFilterChange = (filters: MemberFilterData & { teaches_grad_school?: string }) => {
        setFilters(filters);
        router.get(route('members.index'), {
            ...filters,
            search
        }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('members.index'), {
            ...filters,
            search,
        }, { preserveState: true, replace: true });
    };

    const handleDeleteClick = (member: Member) => {
        setMemberToDelete(member);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (memberToDelete) {
            destroy(route('members.destroy', memberToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setMemberToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (member: Member) => {
        setSelectedMember(member);
        setEditDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="py-6 px-8">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Faculty & Staff</h1>
                </div>
                {/**/}
                <div className="flex flex-col gap-3 md:flex-row mb-4">
                    <div className="flex flex-1 gap-2">
                        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                className="pl-10"
                                placeholder="Search Member..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <MemberFilters filters={filters} setFilters={setFilters} onFilter={handleFilterChange} />
                    </div>
                    {isAdmin && (
                        <div>
                            <Button onClick={() => setCreateDialogOpen(true)}>Add Member</Button>
                        </div>
                    )}
                </div>
                {/**/}

                {/* Members */}
                {members.data.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            {members.data.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center pt-4">
                            <Pagination links={members.links} />
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No members found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            No faculty or staff members match your current search criteria.
                        </p>
                    </div>
                )}
            </div>

            {/*forms*/}
            <MemberForm
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />

            <MemberForm
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                members={selectedMember || undefined}
            />

            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Member"
                message={`Are you sure you want to delete "${memberToDelete?.full_name}"? This action cannot be undone.`}
                loading={processing}
            />
        </AppLayout>
    );
}
