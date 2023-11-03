
export type SubmitFeedbackProps = {
    isOpen: boolean;
    onClose: () => void;
    pageUrl: string;
  }


export type Condition = {
    field: { name: string, label: string } | null;
    operator: 'contains' | 'does not contain';
    value: string;
    logic?: 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';  // This is the new addition
};


export type LogicCard = {
    conditions: Condition[];
    logic: 'AND' | 'OR';
    cardLogic?: 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
    savedSearch?: string; 
    showSavedSearch: boolean;
    selectedSavedParameter?: string;
    logicBeforeSavedParam?: 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
};



export type InputType = 'field' | 'operator' | 'value';

export interface LogicCardProps {
    onAdd: () => void;
    onRemove: (index: number) => void;
    fields: { name: string, label: string }[];
    onLineChange: (lines: Line[], operator: Operator | null) => void;  // Updated this line
}



export type Line = {
    field: string;
    operator: string;
    value: string;
};

export interface SearchFormProps {
    onSearch: (query: string) => void;
    refreshKey: boolean;  // Add this line
}

export interface SavedParametersProps {
    refreshKey: boolean;
    onSearch: (query: string) => void;
    isVisible: boolean;
    savedParameters: SavedSearchParameters[];  // Add this line
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
    job_saved?: JobSaved;
    notes: string;
    column: number;
    order: number;
    timestamp: string;
    job_title?: string;
    company_name?: string;
    company_logo?: string;
    listing_details?: string;
    description?: string;
    location?: string;
    url?: string;
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

//SignUpForm & LoginForm types
export interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    password2: string;
}

export interface SignupLoginProps {
    toggleSignUpModal: () => void;
    toggleLoginModal: () => void;
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
    savedParameters: SavedSearchParameters[];
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

//Feedback types
export interface Feedback {
    id: number;
    url: string;
    feedback: string;
    date_submitted: string;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    feedback: number;
    comment: string;
    date_submitted: string;
}

export interface Upvote {
    user: number;
    feedback?: number;
    comment?: number;
}