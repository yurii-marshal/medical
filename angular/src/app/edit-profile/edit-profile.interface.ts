export interface EditProfileRequest {
    Name: {
        FirstName: string,
        LastName: string,
        MiddleName: string,
    };
    Email: string;
    Password: string;
    NewPassword?: string;
    ProfilePicture: {
        Action: number,
        Crop: string,
        Data: string,
    };
}
