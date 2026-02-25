import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Member, type Research } from '@/types/research';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { FilePlus, FileText, SquarePen, User, UsersRound, } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
import { Textarea } from '../ui/textarea';

interface ResearchFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    research?: Research;
    members?: Member[];
}

export default function ResearchForm({ open, onOpenChange, research, members = [], }: ResearchFormProps) {

    const isEditMode = !!research;
    const { data, setData, post, patch, processing, errors, transform, clearErrors } = useForm(
        {
            research_title: research?.research_title || '',
            funding_source: research?.funding_source || '',
            collaborating_agency: research?.collaborating_agency || '',
            type: research?.type || '',
            program: research?.program || '',
            status: research?.status || '',
            // Proposal Fields
            start_date: research?.start_date || '',
            duration: research?.duration || '',
            estimated_budget: research?.estimated_budget?.toString() || '',
            special_order: null as File | null,
            // Monitoring Fields
            budget_utilized: research?.budget_utilized?.toString() || '',
            completion_percentage:
                research?.completion_percentage?.toString() || '',
            terminal_report: null as File | null,
            year_completed: research?.year_completed || '',
            // DOST6ps
            publication: research?.publication || '',
            patent: research?.patent || '',
            product: research?.product || '',
            people_service: research?.publication || '',
            place_and_partnership: research?.place_and_partnership || '',
            policy: research?.policy || '',
            // Team Members
            member_ids: research?.members?.map((m) => m.id) || [],
        },
    );

    // Reset form when dialog opens/closes or research changes
    useEffect(() => {
        if (open) {
            setData({
                research_title: research?.research_title || '',
                funding_source: research?.funding_source || '',
                collaborating_agency: research?.collaborating_agency || '',
                type: research?.type || '',
                program: research?.program || '',
                status: research?.status || '',
                // Proposal Fields
                start_date: research?.start_date || '',
                duration: research?.duration || '',
                estimated_budget: research?.estimated_budget?.toString() || '',
                special_order: null,
                // Monitoring Fields
                budget_utilized: research?.budget_utilized?.toString() || '',
                completion_percentage:
                    research?.completion_percentage?.toString() || '',
                terminal_report: null,
                year_completed: research?.year_completed || '',
                // DOST6ps
                publication: research?.publication || '',
                patent: research?.patent || '',
                product: research?.product || '',
                people_service: research?.people_service || '',
                place_and_partnership: research?.place_and_partnership || '',
                policy: research?.policy || '',
                // Team Members
                member_ids: research?.members?.map((m) => m.id) || [],
            });
        } else {
            clearErrors();
        }
    }, [open, research, setData, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if there are have file uploads
        const hasFiles =
            data.special_order instanceof File ||
            data.terminal_report instanceof File;

        if (isEditMode && research) {
            if (hasFiles) {
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        // handling File objects
                        if (value instanceof File) {
                            fd.append(key, value);
                        }
                        // handling arrays (e.g., member_ids)
                        else if (Array.isArray(value)) {
                            value.forEach((item) => {
                                fd.append(`${key}[]`, String(item));
                            });
                        }
                        // handling primitive values
                        else if (value !== null && value !== undefined && value !== '') {
                            fd.append(key, String(value));
                        }
                    });
                    fd.append('_method', 'PATCH'); // method spoofing
                    return fd;
                });
                post(route('research.update', research.id), {
                    forceFormData: true,
                    onSuccess: () => onOpenChange(false),
                });
            } else {
                // if no files just patch it
                patch(route('research.update', research.id), {
                    onSuccess: () => onOpenChange(false),
                });
            }
        }
        else {
            if (hasFiles) {
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value instanceof File) {
                            fd.append(key, value);
                        } else if (Array.isArray(value)) {
                            value.forEach((item) => fd.append(`${key}[]`, String(item)));
                        } else if (value !== null && value !== undefined && value !== '') {
                            fd.append(key, String(value));
                        }
                    });
                    return fd;
                });
            }
            post(route('research.store'), {
                forceFormData: hasFiles,
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    const handleMemberToggle = (memberId: number) => {
        const currentIds = data.member_ids || [];
        if (currentIds.includes(memberId)) {
            setData(
                'member_ids',
                currentIds.filter((id) => id !== memberId),
            );
        } else {
            setData('member_ids', [...currentIds, memberId]);
        }
    };

    const handleCancel = () => {
        clearErrors();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto md:max-w-[925px]">
                <DialogHeader>

                    <div className="flex place-items-end justify-center md:justify-start">
                        {isEditMode ? <SquarePen className="mr-2 h-6 w-6" /> : <FilePlus className="mr-2 h-6 w-6" />}
                        <DialogTitle  >
                            {isEditMode ? 'Edit Research Details' : 'Add Research Details'}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {isEditMode ?
                            "Make changes to the research here. Click update when you're done." :
                            "Add research here. Click add when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger className='cursor-pointer' value="details">
                                <FileText className="h-4 w-4 text-green-600" />Research Details
                            </TabsTrigger>

                            <TabsTrigger className='cursor-pointer' value="team">
                                <UsersRound className="h-4 w-4 text-sidebar-accent-foreground" />Team Members
                            </TabsTrigger>

                            <TabsTrigger className='cursor-pointer' value="dost6ps">
                                <img className='h-4 w-4' src="/dost.png" alt="" />DOST 6Ps
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* LEFT COLUMN - Basic Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold">Basic Details</h3>

                                    {/* Research Title - Required */}
                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium" htmlFor="research_title">
                                            Research Title <span className="text-xs text-destructive">*</span>
                                        </Label>
                                        <Input
                                            className="text-sm"
                                            placeholder="Research Title"
                                            value={data.research_title}
                                            onChange={(e) => setData('research_title', e.target.value)}
                                        />
                                        {errors.research_title && (
                                            <p className="text-xs text-destructive">{errors.research_title}</p>
                                        )}
                                    </div>

                                    {/* Funding Source */}
                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium" htmlFor="funding_source">
                                            Funding Source
                                        </Label>
                                        <Input
                                            className="text-sm"
                                            placeholder="Funding Source"
                                            value={data.funding_source}
                                            onChange={(e) => setData('funding_source', e.target.value)}
                                        />
                                        {errors.funding_source && (
                                            <p className="text-xs text-destructive">{errors.funding_source}</p>
                                        )}
                                    </div>

                                    {/* Collaborating Agency */}
                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium" htmlFor="collaborating_agency">
                                            Collaborating Agency
                                        </Label>
                                        <Input
                                            className="text-sm"
                                            placeholder="Collaborating Agency"
                                            value={data.collaborating_agency}
                                            onChange={(e) => setData('collaborating_agency', e.target.value)}
                                        />
                                        {errors.collaborating_agency && (
                                            <p className="text-xs text-destructive">{errors.collaborating_agency}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3 md:flex-row">
                                        {/* Type - Required */}
                                        <div className="grid gap-1 flex-1">
                                            <Label className="text-sm font-medium" htmlFor="type">
                                                Type <span className="text-xs text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.type}
                                                onValueChange={(value) => setData('type', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Select Research Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Research Types</SelectLabel>
                                                        <SelectItem value="study">Study</SelectItem>
                                                        <SelectItem value="project">Project</SelectItem>
                                                        <SelectItem value="program">Program</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.type && (
                                                <p className="text-xs text-destructive">{errors.type}</p>
                                            )}
                                        </div>

                                        {/* Program */}
                                        <div className="grid gap-1 flex-1">
                                            <Label className="text-sm font-medium" htmlFor="program">
                                                Program <span className="text-xs text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.program}
                                                onValueChange={(value) => setData('program', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Select Program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Programs</SelectLabel>
                                                        <SelectItem value="BSIT">BSIT</SelectItem>
                                                        <SelectItem value="BLIS">BLIS</SelectItem>
                                                        <SelectItem value="BSCS">BSCS</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.program && (
                                                <p className="text-xs text-destructive">{errors.program}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status - Required */}
                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium" htmlFor="status">
                                            Status <span className="text-xs text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Select Research Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Research Status</SelectLabel>
                                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="terminated">Terminated</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-xs text-destructive">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN - Proposal and Monitoring Fields */}
                                <div className="space-y-4">
                                    <h3 className="mb-4 text-sm font-semibold">
                                        Proposal & Monitoring Fields
                                    </h3>

                                    {/* Proposal Fields */}
                                    <div className="space-y-4">
                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="start_date">
                                                Start Date
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                            />
                                            {errors.start_date && (
                                                <p className="text-xs text-destructive">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="duration">
                                                Duration
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                placeholder="e.g., 12 months"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', e.target.value)}
                                            />
                                            {errors.duration && (
                                                <p className="text-xs text-destructive">{errors.duration}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="estimated_budget">
                                                Estimated Budget
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={data.estimated_budget}
                                                onChange={(e) => setData('estimated_budget', e.target.value)}
                                            />
                                            {errors.estimated_budget && (
                                                <p className="text-xs text-destructive">{errors.estimated_budget}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="special_order">
                                                Special Order (PDF, DOC, DOCX)
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setData('special_order', file);
                                                }}
                                            />
                                            {errors.special_order && (
                                                <p className="text-xs text-destructive">{errors.special_order}</p>
                                            )}
                                            {research?.special_order && !(data.special_order instanceof File) && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    Current file:{' '}
                                                    {research.special_order.split('/').pop()}
                                                    <a
                                                        href={`/storage/${research.special_order}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-blue-600 underline"
                                                    >
                                                        Link to file
                                                    </a>
                                                </div>
                                            )}
                                            {data.special_order instanceof File && (
                                                <div className="mt-2 text-sm text-green-600">
                                                    Selected: {data.special_order.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Monitoring Fields */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-3 md:flex-row">
                                            <div className="grid gap-1 flex-1">
                                                <Label className="text-sm font-medium" htmlFor="budget_utilized">
                                                    Budget Utilized
                                                </Label>
                                                <Input
                                                    className="text-sm"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={data.budget_utilized}
                                                    onChange={(e) => setData('budget_utilized', e.target.value)}
                                                />
                                                {errors.budget_utilized && (
                                                    <p className="text-xs text-destructive">{errors.budget_utilized}</p>
                                                )}
                                            </div>

                                            <div className="grid gap-1 flex-1">
                                                <Label className="text-sm font-medium" htmlFor="completion_percentage">
                                                    Completion Percent (0-100%)
                                                </Label>
                                                <Input
                                                    className="text-sm"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0"
                                                    value={data.completion_percentage}
                                                    onChange={(e) => setData('completion_percentage', e.target.value)}
                                                />
                                                {errors.completion_percentage && (
                                                    <p className="text-xs text-destructive">{errors.completion_percentage}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="year_completed">
                                                Year Completed
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                placeholder="e.g., 2024"
                                                value={data.year_completed}
                                                onChange={(e) => setData('year_completed', e.target.value)}
                                            />
                                            {errors.year_completed && (
                                                <p className="text-xs text-destructive">{errors.year_completed}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-sm font-medium" htmlFor="terminal_report">
                                                Terminal Report (If Completed) (PDF, DOC, DOCX)
                                            </Label>
                                            <Input
                                                className="text-sm"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setData('terminal_report', file);
                                                }}
                                            />
                                            {errors.terminal_report && (
                                                <p className="text-xs text-destructive">{errors.terminal_report}</p>
                                            )}
                                            {research?.terminal_report && !(data.terminal_report instanceof File) && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    Current file:{' '}
                                                    {research.terminal_report.split('/').pop()}
                                                    <a
                                                        href={`/storage/${research.terminal_report}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-blue-600 underline"
                                                    >
                                                        Link to file
                                                    </a>
                                                </div>
                                            )}
                                            {data.terminal_report instanceof File && (
                                                <div className="mt-2 text-sm text-green-600">
                                                    Selected: {data.terminal_report.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/*Team Members Tabs*/}
                        <TabsContent value="team" className="space-y-4">
                            <div className="mb-4">
                                <Label className="text-md font-medium">
                                    Select Team Members
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Choose members to add to this research
                                    project
                                </p>
                            </div>
                            <div className="max-h-[400px] space-y-2 overflow-y-auto">
                                {members.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No members available. Please add members
                                        first.
                                    </p>
                                ) : (
                                    members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center space-x-2 rounded-md border p-3"
                                        >
                                            <Checkbox
                                                className='cursor-pointer'
                                                id={`member-${member.id}`}
                                                checked={data.member_ids?.includes(
                                                    member.id,
                                                )}
                                                onCheckedChange={() =>
                                                    handleMemberToggle(
                                                        member.id,
                                                    )
                                                }
                                            />
                                            <div className="flex-shrink-0">
                                                {member.profile_photo ? (
                                                    <img
                                                        src={`/storage/${member.profile_photo}`}
                                                        alt={member.full_name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <Label
                                                htmlFor={`member-${member.id}`}
                                                className="flex-1 cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {member.full_name}
                                                {member.rank && (
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        - {member.rank}
                                                    </span>
                                                )}
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        {/*DOST6ps Tabs*/}
                        <TabsContent value="dost6ps" className="space-y-4">
                            <div className="p-2">
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="grid flex-1 gap-4">
                                        {/*div for two description text */}
                                        <div className='flex gap-4 flex-col md:flex-row'>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="publication" className="text-sm">
                                                    Publication
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter Publication Description"
                                                    value={data.publication}
                                                    onChange={(e) => setData('publication', e.target.value)}
                                                />
                                                {errors.publication && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.publication}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="patent" className="text-sm">
                                                    Patent
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter Patent Description"
                                                    value={data.patent}
                                                    onChange={(e) => setData('patent', e.target.value)}
                                                />
                                                {errors.patent && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.patent}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/*div for two description text */}
                                        <div className='flex gap-4 flex-col md:flex-row'>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="product" className="text-sm">
                                                    Product
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter Product Description"
                                                    value={data.product}
                                                    onChange={(e) => setData('product', e.target.value)}
                                                />
                                                {errors.product && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.product}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="people_service" className="text-sm">
                                                    People Service
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter People Service Description"
                                                    value={data.people_service}
                                                    onChange={(e) => setData('people_service', e.target.value)}
                                                />
                                                {errors.people_service && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.people_service}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/*div for two description text*/}
                                        <div className='flex gap-4 flex-col md:flex-row'>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="place_and_partnership" className="text-sm">
                                                    Place and Partnership
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter Place and Partership Description"
                                                    value={data.place_and_partnership}
                                                    onChange={(e) => setData('place_and_partnership', e.target.value)}
                                                />
                                                {errors.place_and_partnership && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.place_and_partnership}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid gap-1 flex-1 width-full">
                                                <Label htmlFor="policy" className="text-sm">
                                                    Policy
                                                </Label>
                                                <Textarea
                                                    className="text-sm"
                                                    placeholder="Enter Policy Description"
                                                    value={data.policy}
                                                    onChange={(e) => setData('policy', e.target.value)}
                                                />
                                                {errors.policy && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.policy}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button disabled={processing} type="submit">
                            {isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
