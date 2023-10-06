
//SearchForm types
export interface SearchResultsProps {
    encodedQuery: string;
}

export interface JobListing {
    id: number;
    job_title: string;
    company_name: string;
    listing_details: string;
    description: string;
    location: string;
    url: string;
}

//JobNotebook types
export interface Card {
    id: number;
    job_saved: JobSaved;
    notes: string;
    column: number;
}
  
export interface Columns {
    id: number;
    name: string;
    owner: Card[];
    order: number;
}
  
  
export interface JobSaved {
    id: number;
    job_listing: JobListing;
    date_saved: string;
}

//SignUpForm types
export interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    password2: string;
}

//SearchForm types
export interface QueryComponent {
    type: 'field' | 'operator';
    value: Operator | string;
    queryName?: string;
    inputValue?: string;
}

export interface CustomQueryBuilderProps {
    onSearch: (query: string) => void;
}

export enum Operator {
    And = 'AND',
    Or = 'OR',
    Not = 'NOT',
    OpenParenthesis = '(',
    CloseParenthesis = ')'
}

//JobNotebookSearch types
export interface JobNotebookSearchProps {
    searchTerm: string;
    onSearchTermChange: (newTerm: string) => void;
}