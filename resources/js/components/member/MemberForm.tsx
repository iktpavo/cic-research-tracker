import { type Member } from "@/types/research";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from "../ui/button";
import { useForm } from "@inertiajs/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { BadgeInfo, CircleUserRound, SquarePen, UserRoundPlus } from "lucide-react";
import { useEffect } from "react";
import { route } from "ziggy-js";
import { ScrollArea } from "../ui/scroll-area";


interface MemberFormProps {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    members?: Member;
}

export default function MemberForm({ open, onOpenChange, members }: MemberFormProps) {
    const isEditMode = !!members;
    const { data, setData, post, put, processing, errors, transform, clearErrors } = useForm({
        full_name: members?.full_name || '',
        rank: members?.rank || '',
        designation: members?.designation || '',
        member_program: members?.member_program || '',
        member_email: members?.member_email || '',
        orcid: members?.orcid || '',
        telephone: members?.telephone || '',
        educational_attainment: members?.educational_attainment || '',
        specialization: members?.specialization || '',
        research_interest: members?.research_interest || '',
        profile_photo: null as File | null,
        teaches_grad_school: members?.teaches_grad_school || false,
    });

    // Reset form when dialog opens/closes or member changes
    useEffect(() => {
        if (open) {
            setData({
                full_name: members?.full_name || '',
                rank: members?.rank || '',
                designation: members?.designation || '',
                member_program: members?.member_program || '',
                member_email: members?.member_email || '',
                orcid: members?.orcid || '',
                telephone: members?.telephone || '',
                educational_attainment: members?.educational_attainment || '',
                specialization: members?.specialization || '',
                research_interest: members?.research_interest || '',
                profile_photo: null,
                teaches_grad_school: members?.teaches_grad_school || false,
            });
        }
        else {
            clearErrors();
        }
    }, [open, members, setData, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if there is a file upload
        const hasFile = data.profile_photo instanceof File;

        if (isEditMode && members) {
            if (hasFile) {
                // Use POST with method spoofing for file uploads
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value instanceof File) {
                            fd.append(key, value);
                        } else if (key === 'teaches_grad_school') {
                            // Convert boolean to '1' or '0' for Laravel
                            fd.append(key, value ? '1' : '0');
                        } else if (value !== null && value !== undefined && value !== '') {
                            fd.append(key, String(value));
                        }
                    });
                    fd.append('_method', 'PUT');
                    return fd;
                });
                post(route('members.update', members.id), {
                    forceFormData: true,
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                });
            } else {
                put(route('members.update', members.id), {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                });
            }
        } else {
            if (hasFile) {
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value instanceof File) {
                            fd.append(key, value);
                        } else if (key === 'teaches_grad_school') {
                            // Convert boolean to '1' or '0' for Laravel
                            fd.append(key, value ? '1' : '0');
                        } else if (value !== null && value !== undefined && value !== '') {
                            fd.append(key, String(value));
                        }
                    });
                    return fd;
                });
            }
            post(route('members.store'), {
                forceFormData: hasFile,
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }

    };


    const handleCancel = () => {
        clearErrors();
        onOpenChange(false);
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[96vh] max-w-[95vw] md:max-w-[570px] p-0">
                <DialogHeader className="px-6 pt-6">
                    <div className="flex items-end justify-center md:justify-start">
                        {isEditMode ? <SquarePen className="mr-2 h-6 w-6" /> : <UserRoundPlus className="mr-2 h-6 w-6" />}
                        <DialogTitle  >
                            {isEditMode ? 'Edit Member Details' : 'Add Member Details'}
                        </DialogTitle>
                    </div>

                    <DialogDescription>
                        {isEditMode ?
                            "Make changes to the member here. Click update when you're done." :
                            "Add Member here. Click add when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(95vh-140px)] px-6">
                    <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className='cursor-pointer' value="details">
                                    <CircleUserRound className="h-4 w-4 text-green-600" /> Member Details
                                </TabsTrigger>
                                <TabsTrigger className='cursor-pointer' value="profile">
                                    <BadgeInfo className="h-4 w-4 text-sidebar-accent-foreground" /> Member Profile
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-4">
                                <div className="p-2">
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="grid flex-1 gap-4">
                                            <div className="grid gap-2.5">
                                                <Label htmlFor="profile_photo" className="text-sm">
                                                    Profile Photo
                                                </Label>
                                                <Input
                                                    type="file"
                                                    className="w-full text-sm"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setData('profile_photo', file);
                                                        }
                                                    }}
                                                />
                                                {members?.profile_photo && !(data.profile_photo instanceof File) && (
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        Current photo: {members.profile_photo.split('/').pop()}
                                                    </div>
                                                )}
                                                {data.profile_photo instanceof File && (
                                                    <div className="mt-2 text-sm text-green-600">
                                                        Selected: {data.profile_photo.name}
                                                    </div>
                                                )}
                                                {errors.profile_photo && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.profile_photo}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-2.5">
                                                <Label htmlFor="full_name" className="text-sm">
                                                    Full Name
                                                    <span className="text-md text-destructive"> *</span>
                                                </Label>
                                                <Input
                                                    className="text-sm"
                                                    placeholder="e.g., Juan Dela Cruz"
                                                    value={data.full_name}
                                                    onChange={(e) => setData('full_name', e.target.value)}
                                                />
                                                {errors.full_name && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.full_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-2.5">
                                                <Label htmlFor="designation" className="text-sm">
                                                    Designation
                                                </Label>
                                                <Input
                                                    className="text-sm"
                                                    placeholder="e.g., CIC Program Head"
                                                    value={data.designation}
                                                    onChange={(e) => setData('designation', e.target.value)}
                                                />
                                                {errors.designation && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.designation}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3 md:flex-row">
                                                <div className="grid gap-2.5 flex-1">
                                                    <Label className="text-sm">
                                                        Rank
                                                        <span className="text-md text-destructive"> *</span>
                                                    </Label>

                                                    <Select
                                                        value={data.rank}
                                                        onValueChange={(value) => setData('rank', value)}
                                                    >
                                                        <SelectTrigger className="w-full text-sm">
                                                            <SelectValue placeholder="Select Rank" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup className="text-sm">
                                                                <SelectLabel>Academic & Staff Ranks</SelectLabel>
                                                                <SelectItem value="Professor">Professor</SelectItem>
                                                                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                                                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                                                <SelectItem value="Instructor">Instructor</SelectItem>
                                                                <SelectItem value="Technical Staff">Technical Staff</SelectItem>
                                                                <SelectItem value="Administrative Aide">Administrative Aide</SelectItem>
                                                                <SelectItem value="Technician">Technician</SelectItem>
                                                                <SelectItem value="Student">Student</SelectItem>
                                                                <SelectItem value="Alumnus">Alumnus</SelectItem>
                                                                <SelectItem value="Alumna">Alumna</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.rank && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.rank}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="grid gap-2.5 flex-1">
                                                    <Label className="text-sm">Program</Label>
                                                    <Select
                                                        value={data.member_program}
                                                        onValueChange={(value) => setData('member_program', value)}
                                                    >
                                                        <SelectTrigger className="w-full text-sm">
                                                            <SelectValue placeholder="Select Program" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup className="text-sm">
                                                                <SelectLabel>Programs</SelectLabel>
                                                                <SelectItem value="BSIT">BSIT</SelectItem>
                                                                <SelectItem value="BLIS">BLIS</SelectItem>
                                                                <SelectItem value="BSCS">BSCS</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.member_program && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.member_program}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid gap-2.5">
                                                <Label htmlFor="member_email" className="text-sm">
                                                    Email
                                                </Label>
                                                <Input
                                                    className="text-sm"
                                                    type="email"
                                                    placeholder="e.g., email@usep.edu.ph"
                                                    value={data.member_email}
                                                    onChange={(e) => setData('member_email', e.target.value)}
                                                />
                                                {errors.member_email && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.member_email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3 md:flex-row">
                                                <div className="grid gap-2.5 flex-1">
                                                    <Label htmlFor="orcid" className="text-sm " >
                                                        ORCID
                                                    </Label>
                                                    <Input
                                                        className="text-sm"
                                                        placeholder="e.g., 1234-4567-8910-1112"
                                                        value={data.orcid}
                                                        onChange={(e) => setData('orcid', e.target.value)}
                                                    />
                                                    {errors.orcid && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.orcid}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="grid gap-2.5 flex-1">
                                                    <Label htmlFor="telephone" className="text-sm">
                                                        Telephone Number
                                                    </Label>
                                                    <Input
                                                        className="text-sm"
                                                        placeholder="e.g., (082) 227-8192 local 249"
                                                        value={data.telephone}
                                                        onChange={(e) => setData('telephone', e.target.value)}
                                                    />
                                                    {errors.telephone && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.telephone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 cursor-pointer"
                                                    checked={data.teaches_grad_school}
                                                    onCheckedChange={(checked) =>
                                                        setData('teaches_grad_school', checked as boolean)
                                                    }
                                                    id="teaches_graduate_school"
                                                />
                                                <Label htmlFor="teaches_graduate_school" className="text-sm cursor-pointer">
                                                    Check if a graduate school teacher
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="profile" className="space-y-4">
                                <div className="p-2">
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="grid flex-1 gap-4">
                                            <div className="grid gap-2.5 w-full">
                                                <Label htmlFor="educational_attainment" className="text-sm">
                                                    Educational Attainment
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="e.g., Bachelor of Science in Information Technology, Master of Science in Library and Information Science"
                                                    value={data.educational_attainment}
                                                    onChange={(e) => setData('educational_attainment', e.target.value)}
                                                />
                                                {errors.educational_attainment && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.educational_attainment}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-2.5 w-full">
                                                <Label htmlFor="specialization" className="text-sm">
                                                    Specialization
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="e.g., Data Science, Software Engineering"
                                                    value={data.specialization}
                                                    onChange={(e) => setData('specialization', e.target.value)}
                                                />
                                                {errors.specialization && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.specialization}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-2.5 w-full">
                                                <Label htmlFor="research_interest" className="text-sm">
                                                    Research Interest
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="e.g., Predictive Analytics, Machine Learning"
                                                    value={data.research_interest}
                                                    onChange={(e) => setData('research_interest', e.target.value)}
                                                />
                                                {errors.research_interest && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.research_interest}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </ScrollArea>

                <DialogFooter className="px-6 pb-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button disabled={processing} type="submit" onClick={handleSubmit}>
                        {isEditMode ? 'Update' : 'Add '}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}