
import { useId } from 'react';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchWithLoaderProps {
    value: string;
    onSearchChange: (value: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

export const SearchWithLoader: React.FC<SearchWithLoaderProps> = ({
    value,
    onSearchChange,
    isLoading,
    placeholder = 'Search...',
}) => {
    const id = useId();


    return (
        <div className='w-full max-w-xs space-y-2'>
            <div className='relative'>
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                    <SearchIcon className='size-4' />
                    <span className='sr-only'>Search</span>
                </div>
                <Input
                    id={id}
                    type='search'
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onSearchChange(e.target.value)}
                    className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
                />
                {isLoading && (
                    <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
                        <LoaderCircleIcon className='size-4 animate-spin' />
                        <span className='sr-only'>Loading...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchWithLoader;