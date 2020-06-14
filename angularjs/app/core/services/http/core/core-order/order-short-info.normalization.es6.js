export function normalizeOrderShortInfoData(data) {

    // TODO full data (this only for QuickShip)
    const orderShortInfoState = {
        id: data.Id.toString(),
        orderDisplayId: data.DisplayId,
        createdDate: data.CreatedDate,
        referralCard: (function() {
            let referral = null;

            if (data.ReferralCard && data.ReferralCard.Physician) {
                referral = data.ReferralCard.Physician.Name ?
                    data.ReferralCard.Physician.Name.FullName :
                    data.ReferralCard.Physician.Practice;
            }

            return referral || '-';
        })()
    };

    return orderShortInfoState;
}


/*
    {
      "Id": "string",
      "DisplayId": "string",
      "Type": {
        "Id": "string",
        "Text": "string"
      },
      "Patient": {
        "Id": 0,
        "Name": {
          "First": "string",
          "Last": "string",
          "Middle": "string",
          "FullName": "string"
        },
        "DateOfBirth": "2018-07-26T12:02:53.980Z",
        "Gender": {
          "Id": "string",
          "Text": "string"
        },
        "Address": {
          "AddressLine": "string",
          "AddressLine2": "string",
          "City": "string",
          "Zip": "string",
          "State": "string"
        },
        "Mobile": "string",
        "HomePhone": "string",
        "PrimaryInsurance": {
          "Name": "string",
          "CreatedDate": "2018-07-26T12:02:53.980Z"
        }
      },
      "ReferralCard": {
        "Id": "string",
        "Physician": {
          "Id": "string",
          "Name": {
            "First": "string",
            "Last": "string",
            "Middle": "string",
            "FullName": "string"
          },
          "Npi": "string",
          "Practice": "string"
        },
        "Location": {
          "Address": "string",
          "Phone": "string",
          "Fax": "string",
          "Email": "string"
        }
      },
      "StartDate": "2018-07-26T12:02:53.980Z",
      "CreatedDate": "2018-07-26T12:02:53.980Z",
      "State": {
        "Status": {
          "Id": "string",
          "Text": "string"
        }
      }
    }
*/
