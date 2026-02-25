import { Member } from './research';

export interface Publication {
    id: number;
    publication_title: string;
    journal: string;
    publication_year: string;
    publication_program: 'BSIT' | 'BLIS' | 'BSCS' | null;
    isbn?: string;
    'p-issn'?: string;
    'e-issn'?: string;
    publisher: string;
    online_view: string;
    incentive_file?: string;
    product_file?: string;
    patent_file?: string;
    members?: Member[];
    created_at?: string;
    updated_at?: string;
}
