export interface CvPersonal {
    fullName: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
}

export interface CvExperience {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    highlights: string[];
}

export interface CvEducation {
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
}

export interface CvLanguage {
    name: string;
    level?: string;
}

export interface CvData {
    personal: CvPersonal;
    summary: string;
    experience: CvExperience[];
    education: CvEducation[];
    skills: string[];
    languages: CvLanguage[];
}