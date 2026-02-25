import { useState } from 'react';
import { Member } from '@/types/research';
import { Button } from '@/components/ui/button';
import {
    Pencil, Trash2, Mail, Phone, Fingerprint,
    BookOpen, CheckCircle2, FileText,
    Eye
} from 'lucide-react';
import MemberPhoto from './MemberPhoto';
import MemberTabs from './MemberTabs';
import MemberDetails from './MemberDetails';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
    member: Member;
    onEdit: (member: Member) => void;
    onDelete: (member: Member) => void;
    isAdmin?: boolean;
}

export default function MemberCard({ member, onEdit, onDelete, isAdmin }: Props) {
    // default education
    const [activeTab, setActiveTab] = useState('education');

    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-300 bg-white dark:bg-transparent animate-in fade-in slide-in-from-left-2 duration-300">

            {/* action buttons */}
            <div className="absolute right-3 top-3 flex gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-6 text-green-600 hover:bg-green-50 hover:text-green-600">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>View</TooltipContent>
                </Tooltip>

                {isAdmin && (<>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => onEdit(member)} variant="ghost" size="icon" className="h-8 w-6 text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => onDelete(member)} variant="ghost" size="icon" className="h-8 w-6 text-red-500 hover:bg-red-50 hover:text-red-500   ">
                            <Trash2 className="h-4 w-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                </>
                )}
            </div>

            <div className="flex flex-col md:flex-row">

                {/* --- LEFT SECTION: Visual Identity & Stats --- */}
                <div className="flex w-full flex-col items-center justify-center p-6 md:w-72 md:border-r border-gray-100 bg-white dark:bg-transparent">

                    {/* Profile Photo */}
                    <div className="relative mb-6">
                        <div className="rounded-full border-[1px] border-gray-200 p-1">
                            <MemberPhoto
                                imageUrl={member.profile_photo}
                                size="xl"
                                className="h-32 w-32"
                            />
                        </div>
                    </div>

                    {/* research stats */}
                    <div className='text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-3'>
                        Research Statistics
                    </div>
                    <div className="flex w-full items-center justify-center gap-5 text-center">
                        <div className="group/stat cursor-help">
                            <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                                <BookOpen className="h-4 w-4 text-sidebar-accent-foreground" />
                            </div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-400">{member.ongoing}</span>
                            <span className="text-[10px] text-gray-700 dark:text-gray-400 font-medium uppercase tracking-wider">Ongoing</span>
                        </div>

                        <div className="h-8 w-px bg-gray-200" /> {/* separator */}

                        <div className="group/stat cursor-help">
                            <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                                <CheckCircle2 className="h-4 w-4 text-side text-green-600" />
                            </div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-400">{member.completed}</span>
                            <span className="text-[10px] text-gray-700 dark:text-gray-400 font-medium uppercase tracking-wider">Done</span>
                        </div>

                        <div className="h-8 w-px bg-gray-200" /> {/* sepasrator */}

                        {/* published placeholder */}
                        <div className="group/stat cursor-help">
                            <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                                <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-400">{member.publication_count}</span>
                            <span className="text-[10px] text-gray-700 dark:text-gray-400 font-medium uppercase tracking-wider">Published</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT SECTION: header details and contexts--- */}
                <div className="flex flex-1 flex-col p-6 md:pl-8">

                    {/* header informations*/}
                    <div className="mb-8">
                        <div className="flex flex-col">
                            <h3 className="font-sans text-xl font-bold text-gray-900 dark:text-gray-200 tracking-tight">
                                {member.full_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
                                <span className="font-medium text-gray-900 dark:text-gray-500">
                                    {member.designation || 'Faculty & Staff'}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500 font-medium">
                                    {member.rank}
                                </span>
                            </div>

                            {/* contact details grid*/}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                {member.member_email && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900">
                                        <Mail className="h-4 w-4" />
                                        <span>{member.member_email}</span>
                                    </div>
                                )}
                                {member.telephone && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Phone className="h-4 w-4" />
                                        <span>{member.telephone}</span>
                                    </div>
                                )}
                                {member.orcid && (
                                    <div className="flex items-center gap-2 text-xs text-green-600 transition-colors">
                                        <Fingerprint className="h-4 w-4" />
                                        <span className="font-mono">{member.orcid}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* tabbed contente area*/}
                    <div className="mt-auto">
                        <MemberTabs activeTab={activeTab} onTabChange={setActiveTab} />
                        <div className="pt-4 min-h-[110px]">
                            <MemberDetails member={member} activeTab={activeTab} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}