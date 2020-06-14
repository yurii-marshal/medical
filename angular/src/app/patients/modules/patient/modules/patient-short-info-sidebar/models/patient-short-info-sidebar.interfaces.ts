import { Tag } from '@shared/endpoints/core/tags/tags.interface';

export interface ShortInfo {
    patient: PatientShortInfo;
    tags: Tag[];
}

export interface PatientShortInfo {
    DisplayId: string;
    Name: {
        FullName: string;
        First: string;
        Middle: string;
        Last: string;
    };
    DateOfBirthday: Date;
    Status: {
        Id: number;
        Text: string;
        Description: string;
    };
    Gender: {
        Id: number;
        Text: string;
        Description: string
    };
    Email: string;
    Address: {
        AddressLine: string;
        AddressLine2: string;
        City: string;
        Zip: string;
        State: string
    };
    Mobile: string;
    HomePhone: string;
    WorkPhone: string;
    Location: string;
    Ssn: string;
    Insurances: [
        {
            Name: string;
            CreatedDate: Date;
            PositionIndex: number
        }
        ];
    Orders: [
        {
            Id: number;
            DisplayId: number;
            CreatedDate: Date;
            Physician: {
                Name: {
                    FullName: string;
                },
            }
        }
        ];
    RecentAppointments: PatientRecentAppointment[];
    PhoneExtension: string;
    MedSageEnrolled: true;
    CanBeEnrolledToMedSage: true;
    Id: number;
}

export interface PatientRecentAppointment {
    Id: string;
    DisplayId: string;
    DateRange: {
        From: Date;
        To: Date;
    };
    AppointmentStatus: {
        Id: number;
        Text: string;
        Description: string;
    };
    Relations: [
        {
            OrderId: string;
            DisplayId: string;
            Completed: true;
            PhysicianName: string;
        }
        ];
}
