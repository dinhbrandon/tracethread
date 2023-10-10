
//SearchForm types

// Search parameters have the following format:
// user = models.ForeignKey(User, on_delete=models.CASCADE)
// job_listing = models.ForeignKey(JobListing, on_delete=models.CASCADE)
// date_saved = models.DateTimeField(auto_now_add=True)

export interface SavedParametersProps {
    refreshKey: boolean;
}

export interface SavedSearchParameters {
    id: number;
    name: string;
    query: string;
    date_saved: string;
}

export interface SearchResultsProps {
    encodedQuery: string;
}

export interface JobListing {
    id: number;
    job_title: string;
    company_name: string;
    company_logo: string;
    listing_details: string;
    description: string;
    location: string;
    date: string;
    url: string;
}

//JobNotebook types
export interface Card {
    id: number;
    job_saved: JobSaved;
    notes: string;
    column: number;
    timestamp: string;
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
    onRefresh: () => void; 
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