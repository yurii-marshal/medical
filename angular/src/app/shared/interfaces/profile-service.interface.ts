export interface Name {
    First: string;
    Middle: string;
    Last: string;
    FullName: string;
}

export interface Personnel {
    UserId: number;
    ScheduleAble: boolean;
    Credentials: string;
    Certifications: string;
    Login: string;
    Email: string;
    StartDate: string;
    Tags: string[];
    Name: Name;
    Id: number;
}

export interface PersonnelItems {
    Count: number;
    Items: Personnel[];
}
