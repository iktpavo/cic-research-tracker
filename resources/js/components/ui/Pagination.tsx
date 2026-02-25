import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, index) => {
                if (link.label === 'pagination.previous' || link.label === 'pagination.next') {
                    return null;
                }

                const isActive = link.active;
                const isDisabled = !link.url;

                if (index === 0 || index === links.length - 1) {
                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveScroll
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            aria-disabled={isDisabled}
                        >
                            {index === 0 ? (
                                <>
                                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                    Previous
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Link>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                     ${isActive
                                ? 'bg-black text-white'
                                : isDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}