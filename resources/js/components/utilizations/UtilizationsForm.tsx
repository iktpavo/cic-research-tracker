import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { type Research, type Utilization } from '@/types/research';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { FilePlus, SquarePen } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';

interface UtilizationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    utilization?: Utilization;
    researches: Research[];
}

export default function UtilizationForm({ open, onOpenChange, utilization, researches }: UtilizationFormProps) {
    const isEditMode = !!utilization;
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, errors, transform, clearErrors } = useForm({
        research_id: utilization?.research_id || '',
        beneficiary: utilization?.beneficiary || '',
        cert_date: utilization?.cert_date || '',
        certificate_of_utilization: null as File | null,
    });

    useEffect(() => {
        if (open) {
            setData({
                research_id: utilization?.research_id || '',
                beneficiary: utilization?.beneficiary || '',
                cert_date: utilization?.cert_date || '',
                certificate_of_utilization: null,
            });
            setSearchQuery('');
        } else {
            clearErrors();
        }
    }, [open, utilization, setData, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasFile = data.certificate_of_utilization instanceof File;

        if (isEditMode && utilization) {
            if (hasFile) {
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value instanceof File) fd.append(key, value);
                        else if (value !== null && value !== undefined && value !== '') fd.append(key, String(value));
                    });
                    fd.append('_method', 'PUT');
                    return fd;
                });
                post(route('utilizations.update', utilization.id), { forceFormData: true, onSuccess: () => onOpenChange(false) });
            } else {
                put(route('utilizations.update', utilization.id), { onSuccess: () => onOpenChange(false) });
            }
        } else {
            if (hasFile) {
                transform((formData) => {
                    const fd = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value instanceof File) fd.append(key, value);
                        else if (value !== null && value !== undefined && value !== '') fd.append(key, String(value));
                    });
                    return fd;
                });
            }
            post(route('utilizations.store'), { forceFormData: hasFile, onSuccess: () => onOpenChange(false) });
        }
    };

    const handleCancel = () => {
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-end justify-center md:justify-start">
                        {isEditMode ? <SquarePen className="mr-2 h-6 w-6" /> : <FilePlus className="mr-2 h-6 w-6" />}
                        <DialogTitle>{isEditMode ? 'Edit Utilization' : 'Add Utilization'}</DialogTitle>
                    </div>
                    <DialogDescription>
                        {isEditMode ? 'Update the utilization record here.' : 'Fill in the details to add a new utilization record.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Research - Display Only when Editing, Combobox when Adding */}
                    <div className="grid gap-1">
                        <Label htmlFor="research_id" className="text-sm font-medium">
                            Research <span className="text-xs text-destructive">*</span>
                        </Label>

                        {isEditMode ? (
                            <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                {researches.find(r => r.id === data.research_id)?.research_title || 'Unknown Research'}
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                                        {data.research_id
                                            ? researches.find(r => r.id === data.research_id)?.research_title
                                            : 'Select Research'}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search Research..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandEmpty>No research found.</CommandEmpty>
                                        <CommandGroup className="max-h-[200px] overflow-auto">
                                            {researches
                                                .filter(r =>
                                                    !r.utilization && r.research_title.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map(r => (
                                                    <CommandItem
                                                        key={r.id}
                                                        value={r.research_title}
                                                        onSelect={() => {
                                                            setData('research_id', r.id);
                                                            setSearchQuery('');
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {r.research_title}
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}

                        {errors.research_id && <p className="text-xs text-destructive">{errors.research_id}</p>}
                    </div>

                    {/* Beneficiary */}
                    <div className="grid gap-1">
                        <Label htmlFor="beneficiary" className="text-sm font-medium">
                            Beneficiary <span className="text-xs text-destructive">*</span>
                        </Label>
                        <Input
                            value={data.beneficiary}
                            onChange={(e) => setData('beneficiary', e.target.value)}
                            placeholder="Beneficiary Name"
                            className="text-sm"
                        />
                        {errors.beneficiary && <p className="text-xs text-destructive">{errors.beneficiary}</p>}
                    </div>

                    {/* Certificate Date */}
                    <div className="grid gap-1">
                        <Label htmlFor="cert_date" className="text-sm font-medium">
                            Certificate Date <span className="text-xs text-destructive">*</span>
                        </Label>
                        <Input
                            type="date"
                            value={data.cert_date}
                            onChange={(e) => setData('cert_date', e.target.value)}
                            className="text-sm"
                        />
                        {errors.cert_date && <p className="text-xs text-destructive">{errors.cert_date}</p>}
                    </div>

                    {/* Certificate File */}
                    <div className="grid gap-1">
                        <Label htmlFor="certificate_of_utilization" className="text-sm font-medium">
                            Certificate File (PDF, DOC, DOCX, max 50MB)
                        </Label>
                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setData('certificate_of_utilization', file);
                            }}
                        />
                        {errors.certificate_of_utilization && (
                            <p className="text-xs text-destructive">{errors.certificate_of_utilization}</p>
                        )}

                        {/* Show current file if editing */}
                        {utilization?.certificate_of_utilization && !(data.certificate_of_utilization instanceof File) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                Current file: {utilization.certificate_of_utilization.split('/').pop()}
                                <a
                                    href={`/storage/${utilization.certificate_of_utilization}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 underline"
                                >
                                    View
                                </a>
                            </div>
                        )}

                        {/* Show newly selected file */}
                        {data.certificate_of_utilization instanceof File && (
                            <div className="mt-2 text-sm text-green-600">
                                Selected: {data.certificate_of_utilization.name} ({(data.certificate_of_utilization.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={handleCancel} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}