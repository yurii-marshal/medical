export interface Name {
    FirstName: string;
    LastName: string;
    MiddleName: string;
}

export interface Profile {
    Id: string;
    Email: string;
    Login: string;
    Name: Name;
    FullName?: string;
    NeedChangePassword: boolean;
    PersonnelId: number;
    Picture?: string;
    PictureData?: string;
    PicturePlaceholder?: string;
    Schedulable: boolean;
    PictureUrl: string;
}

export class ProfileMock implements Profile {
    Id = null;
    Email = null;
    Login = null;
    PictureUrl = null;
    Name = {
        FirstName: null,
        LastName: null,
        MiddleName: null,
    };
    NeedChangePassword = null;
    PersonnelId = null;
    Schedulable = null;
}
