using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Models.Reports;

namespace WebPortal.Selenium.Tests.Tests.Reports
{
    public partial class Data
    {
        public ReportModel ReferralManagementReport = new ReportModel()
        {
            DataSourceName = "Referral Management",
            FieldList = new List<Field>()
        {
            new Field()
            {
                Name = "NPI",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "1629007588" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "1629007588" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "162" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "162" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Practice",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Rivne Branch" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Rivne Branch" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Referring Phys. Office Address",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "334 US-46, Wayne, Passaic, NJ, 07470" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "334 US-46, Wayne, Passaic, NJ, 07470" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Referring Phys. Office City",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "way" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "way" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },


             new Field()
            {
                Name = "Referring Phys. Office County",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Passaic" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Passaic" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office Fax",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "9854965656" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "9854965656" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "1" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "0" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office State",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "New Jersey" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "New Jersey" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office Tel.",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "9736947944" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "9736947944" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "1" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "0" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office ZIP Code",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "07470 New Jersey Passaic Wayne", UseValueToCheck =true, ValueToCheck = "07470"  },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "07470 New Jersey Passaic Wayne" , UseValueToCheck =true, ValueToCheck = "07470" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Referring Physician",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "FARIDA ABID" , UseValueToCheck =true, ValueToCheck = "ABID, FARIDA" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "FARIDA ABID" , UseValueToCheck =true, ValueToCheck = "ABID, FARIDA" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Sales Person",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Christina  S. Barrios", UseValueToCheck =true, ValueToCheck = "Barrios Christina" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Christina  S. Barrios", UseValueToCheck =true, ValueToCheck = "Barrios Christina" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },
        }
        };

    }
}
