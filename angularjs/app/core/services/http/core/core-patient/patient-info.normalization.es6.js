import { patientGenderConstants } from '../../../../constants/core.constants.es6';
import { patientGenderConstantsV1 } from '../../../../constants/core.constants.es6';
import { transformAddress } from '../../../../helpers/transform-address.helper.es6';

export function normalizePatientInfoData(data) {

    // TODO full data (this only for QuickShip)
    const patientState = {
        id: data.Id.toString(),
        firstName: data.Name.First,
        lastName: data.Name.Last,
        fullName: `${data.Name.First} ${data.Name.Middle ? data.Name.Middle : ''} ${data.Name.Last}`,
        gender: (function() {
            let gender = null,
                id = data.Gender.Id.toString();

            // mapping for old dictionary with integers
            for (let key in patientGenderConstantsV1) {
                if (patientGenderConstantsV1[key] === id) {
                    gender = patientGenderConstants[key];
                }
            }

            // mapping for new dictionary with enums
            if (!gender) {
                for (let key in patientGenderConstants) {
                    if (patientGenderConstantsV1[key] === id) {
                        gender = patientGenderConstants[key];
                    }
                }
            }

            return gender;

        })(),
        dateOfBirth: moment(data.DateOfBirthday).format('MM/DD/YYYY'),
        deliveryFullAddress: transformAddress(data.DeliveryAddress)
    };

    return patientState;
}


/*
{
  "DisplayId": "string",
  "DateOfBirthday": "2018-07-26T12:02:54.555Z",
  "Gender": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "Address": {
    "FullAddress": "string",
    "AddressLine": "string",
    "AddressLine2": "string",
    "City": "string",
    "Zip": "string",
    "State": "string"
  },
  "DeliveryAddress": {
    "FullAddress": "string",
    "AddressLine": "string",
    "AddressLine2": "string",
    "City": "string",
    "Zip": "string",
    "State": "string"
  },
  "Status": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "StatusDate": "2018-07-26T12:02:54.555Z",
  "InactiveStatus": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "DcDate": "2018-07-26T12:02:54.555Z",
  "Ssn": "string",
  "NickName": "string",
  "Prefix": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "MaritalStatus": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "Height": 0,
  "Weight": 0,
  "Location": {
    "Id": "string",
    "Text": "string",
    "Npi": "string"
  },
  "PreferredPatientPhoneType": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "PreferredCallTime": {
    "Id": 0,
    "Text": "string",
    "Description": "string"
  },
  "PatientContacts": [
    {
      "Value": "string",
      "Type": {
        "Id": 0,
        "Text": "string",
        "Description": "string"
      },
      "PhoneExtension": "string"
    }
  ],
  "EmergencyContact": {
    "EmergencyPerson": {
      "First": "string",
      "Middle": "string",
      "Last": "string",
      "FullName": "string"
    },
    "EmergencyRelationship": {
      "Id": 0,
      "Text": "string",
      "Description": "string"
    },
    "EmergencyRelationshipOther": "string",
    "EmergencyAddress": {
      "FullAddress": "string",
      "AddressLine": "string",
      "AddressLine2": "string",
      "City": "string",
      "Zip": "string",
      "State": "string"
    },
    "EmergencyContacts": [
      {
        "Value": "string",
        "Type": {
          "Id": 0,
          "Text": "string",
          "Description": "string"
        },
        "PhoneExtension": "string"
      }
    ]
  },
  "EmployerContact": {
    "Employer": "string",
    "BusinessAddress": {
      "FullAddress": "string",
      "AddressLine": "string",
      "AddressLine2": "string",
      "City": "string",
      "Zip": "string",
      "State": "string"
    },
    "EmployerContacts": [
      {
        "Value": "string",
        "Type": {
          "Id": 0,
          "Text": "string",
          "Description": "string"
        },
        "PhoneExtension": "string"
      }
    ]
  },
  "ResponsibleContact": {
    "ResponsiblePerson": {
      "First": "string",
      "Middle": "string",
      "Last": "string",
      "FullName": "string"
    },
    "ResponsibleType": {
      "Id": 0,
      "Text": "string",
      "Description": "string"
    },
    "ResponsibleAddress": {
      "FullAddress": "string",
      "AddressLine": "string",
      "AddressLine2": "string",
      "City": "string",
      "Zip": "string",
      "State": "string"
    },
    "ResponsibleContacts": [
      {
        "Value": "string",
        "Type": {
          "Id": 0,
          "Text": "string",
          "Description": "string"
        },
        "PhoneExtension": "string"
      }
    ]
  },
  "MedicalReleaseInfo": [
    {
      "Name": {
        "First": "string",
        "Middle": "string",
        "Last": "string",
        "FullName": "string"
      },
      "RelationType": {
        "Id": 0,
        "Text": "string",
        "Description": "string"
      },
      "Email": "string",
      "Phone": "string"
    }
  ],
  "Organization": {
    "Id": "string",
    "Text": "string",
    "Description": "string"
  },
  "SignatureOnFile": {
    "IsSigned": true,
    "SignedDate": "2018-07-26T12:02:54.556Z"
  },
  "Tags": [
    {
      "Id": "string",
      "Name": "string"
    }
  ],
  "Name": {
    "First": "string",
    "Middle": "string",
    "Last": "string",
    "FullName": "string"
  },
  "Id": 0
}
 */
