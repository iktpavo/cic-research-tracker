import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Publication } from '@/types/publication';
import { Member } from '@/types/research';
import { useForm } from '@inertiajs/react';
import { FilePlus, SquarePen } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface PublicationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    publication?: Publication;
    members?: Member[];
}

export default function PublicationForm({
    open,
    onOpenChange,
    publication,
    members = [],
}: PublicationFormProps) {
    const isEditMode = !!publication;

    const { data, setData, post, patch, processing, errors, transform, clearErrors, reset } = useForm({
        publication_title: publication?.publication_title || '',
        journal: publication?.journal || '',
        publication_year: publication?.publication_year || '',
        publication_program: publication?.publication_program || '',
        isbn: publication?.isbn || '',
        'p-issn': publication?.['p-issn'] || '',
        'e-issn': publication?.['e-issn'] || '',
        publisher: publication?.publisher || '',
        online_view: publication?.online_view || '',
        incentive_file: null as File | null,
        product_file: null as File | null,
        patent_file: null as File | null,
        member_ids: publication?.members?.map((m) => m.id.toString()) || [],
    });

    useEffect(() => {
        if (open) {
            setData({
                publication_title: publication?.publication_title || '',
                journal: publication?.journal || '',
                publication_year: publication?.publication_year || '',
                publication_program: publication?.publication_program || '',
                isbn: publication?.isbn || '',
                'p-issn': publication?.['p-issn'] || '',
                'e-issn': publication?.['e-issn'] || '',
                publisher: publication?.publisher || '',
                online_view: publication?.online_view || '',
                incentive_file: null,
                product_file: null,
                patent_file: null,
                member_ids: publication?.members?.map((m) => m.id.toString()) || [],
            });
        } else {
            clearErrors();
            reset();
        }
    }, [open, publication, clearErrors, reset, setData]);   //lint fix

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasFile =
            data.incentive_file instanceof File ||
            data.product_file instanceof File ||
            data.patent_file instanceof File;

        if (isEditMode && publication) {
            if (hasFile) {
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
                    fd.append('_method', 'PATCH');
                    return fd;
                });
                post(route('publications.update', publication.id), {
                    forceFormData: true,
                    onSuccess: () => onOpenChange(false),
                });
            } else {
                patch(route('publications.update', publication.id), {
                    onSuccess: () => onOpenChange(false),
                });
            }
        } else {
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
            post(route('publications.store'), {
                forceFormData: hasFile,
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const memberOptions = members.map((member) => ({
        value: member.id.toString(),
        label: member.full_name,
    }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto md:max-w-[800px]">
                <DialogHeader>
                    <div className="flex place-items-end justify-center md:justify-start">
                        {isEditMode ? (
                            <SquarePen className="mr-2 h-6 w-6" />
                        ) : (
                            <FilePlus className="mr-2 h-6 w-6" />
                        )}
                        <DialogTitle>
                            {isEditMode ? 'Edit Publication' : 'Add Publication'}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {isEditMode
                            ? "Make changes to the publication here. Click update when you're done."
                            : "Add publication details here. Click add when you're done."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="publication_title">
                                Publication Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="publication_title"
                                value={data.publication_title}
                                onChange={(e) => setData('publication_title', e.target.value)}
                                placeholder="Enter publication title"
                            />
                            {errors.publication_title && (
                                <p className="text-xs text-destructive">{errors.publication_title}</p>
                            )}
                        </div>

                        {/* Journal & Publisher */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="journal">
                                    Journal <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="journal"
                                    value={data.journal}
                                    onChange={(e) => setData('journal', e.target.value)}
                                    placeholder="Enter journal name"
                                />
                                {errors.journal && (
                                    <p className="text-xs text-destructive">{errors.journal}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publisher">
                                    Publisher <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="publisher"
                                    value={data.publisher}
                                    onChange={(e) => setData('publisher', e.target.value)}
                                    placeholder="Enter publisher name"
                                />
                                {errors.publisher && (
                                    <p className="text-xs text-destructive">{errors.publisher}</p>
                                )}
                            </div>
                        </div>

                        {/* Year & Program */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="publication_year">
                                    Year <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="publication_year"
                                    value={data.publication_year}
                                    onChange={(e) => setData('publication_year', e.target.value)}
                                    placeholder="YYYY"
                                    maxLength={4}
                                />
                                {errors.publication_year && (
                                    <p className="text-xs text-destructive">{errors.publication_year}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publication_program">Program</Label>
                                <Select
                                    value={data.publication_program || ''}
                                    onValueChange={(value) => setData('publication_program', value)}
                                >
                                    <SelectTrigger>
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
                                {errors.publication_program && (
                                    <p className="text-xs text-destructive">{errors.publication_program}</p>
                                )}
                            </div>
                        </div>

                        {/* ISBN/ISSN */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input
                                    id="isbn"
                                    value={data.isbn}
                                    onChange={(e) => setData('isbn', e.target.value)}
                                    placeholder="ISBN"
                                />
                                {errors.isbn && (
                                    <p className="text-xs text-destructive">{errors.isbn}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="p-issn">P-ISSN</Label>
                                <Input
                                    id="p-issn"
                                    value={data['p-issn']}
                                    onChange={(e) => setData('p-issn', e.target.value)}
                                    placeholder="P-ISSN"
                                />
                                {errors['p-issn'] && (
                                    <p className="text-xs text-destructive">{errors['p-issn']}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="e-issn">E-ISSN</Label>
                                <Input
                                    id="e-issn"
                                    value={data['e-issn']}
                                    onChange={(e) => setData('e-issn', e.target.value)}
                                    placeholder="E-ISSN"
                                />
                                {errors['e-issn'] && (
                                    <p className="text-xs text-destructive">{errors['e-issn']}</p>
                                )}
                            </div>
                        </div>

                        {/* Online View */}
                        <div className="grid gap-2">
                            <Label htmlFor="online_view">
                                Online View Link <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="online_view"
                                value={data.online_view}
                                onChange={(e) => setData('online_view', e.target.value)}
                                placeholder="https://..."
                            />
                            {errors.online_view && (
                                <p className="text-xs text-destructive">{errors.online_view}</p>
                            )}
                        </div>

                        {/* Authors (MultiSelect) */}
                        <div className="grid gap-2">
                            <Label>Authors</Label>
                            <MultiSelect
                                values={data.member_ids}
                                onValuesChange={(values) => setData('member_ids', values)}
                            >
                                <MultiSelectTrigger className="w-full">
                                    <MultiSelectValue placeholder="Select authors" overflowBehavior="wrap-when-open" />
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                    {memberOptions.map((option) => (
                                        <MultiSelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectContent>
                            </MultiSelect>
                            {errors.member_ids && (
                                <p className="text-xs text-destructive">{errors.member_ids}</p>
                            )}
                        </div>

                        {/* File Uploads Parent Div */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            {/* Incentive File */}
                            <div className="grid gap-2">
                                <Label htmlFor="incentive_file">
                                    Incentive File (PDF, DOC, DOCX)
                                </Label>
                                <Input
                                    id="incentive_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setData('incentive_file', file);
                                    }}
                                />
                                {errors.incentive_file && (
                                    <p className="text-xs text-destructive">{errors.incentive_file}</p>
                                )}
                                {publication?.incentive_file && !(data.incentive_file instanceof File) && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Current file: {publication.incentive_file.split('/').pop()}
                                    </div>
                                )}
                                {data.incentive_file instanceof File && (
                                    <div className="mt-1 text-xs text-green-600">
                                        Selected: {data.incentive_file.name}
                                    </div>
                                )}
                            </div>
                            {/*Product certificate product_file*/}
                            <div className="grid gap-2">
                                <Label htmlFor="product_file">
                                    Product Cert. (PDF, DOC, DOCX)
                                </Label>
                                <Input
                                    id="product_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setData('product_file', file);
                                    }}
                                />
                                {errors.product_file && (
                                    <p className="text-xs text-destructive">{errors.product_file}</p>
                                )}
                                {publication?.product_file && !(data.product_file instanceof File) && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Current file: {publication.product_file.split('/').pop()}
                                    </div>
                                )}
                                {data.product_file instanceof File && (
                                    <div className="mt-1 text-xs text-green-600">
                                        Selected: {data.product_file.name}
                                    </div>
                                )}
                            </div>
                            {/*Patent certificate patent_file*/}
                            <div className="grid gap-2">
                                <Label htmlFor="patent_file">
                                    Patent Cert. (PDF, DOC, DOCX)
                                </Label>
                                <Input
                                    id="patent_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setData('patent_file', file);
                                    }}
                                />
                                {errors.patent_file && (
                                    <p className="text-xs text-destructive">{errors.patent_file}</p>
                                )}
                                {publication?.patent_file && !(data.patent_file instanceof File) && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Current file: {publication.patent_file.split('/').pop()}
                                    </div>
                                )}
                                {data.patent_file instanceof File && (
                                    <div className="mt-1 text-xs text-green-600">
                                        Selected: {data.patent_file.name}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
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
