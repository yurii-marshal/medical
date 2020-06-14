using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Models.Reports;

namespace WebPortal.Selenium.Tests.Tests.Reports
{
    public partial class Data
    {
        public ReportModel PatientReport = new ReportModel()
    {
        DataSourceName = "Patient",
        FieldList = new List<Field>()
        {
            new Field()
            {
                Name = "Effective Date",
                Filter = FilterTypes.Date,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.DateIs, StartDate = new DateTime(2015,12,29) },
                    new OperationWithValues () { Type = OperationType.DateIsNot, StartDate = new DateTime(2015,12,29) },
                    new OperationWithValues () { Type = OperationType.DateMoreThan, StartDate = new DateTime(2015,12,29) },
                    new OperationWithValues () { Type = OperationType.DateLesThan, StartDate = new DateTime(2015,12,29) },
                    new OperationWithValues () { Type = OperationType.Between, StartDate = new DateTime(2015,12,29),  EndDate = new DateTime(2016,05,04)},

                }
            },

            new Field()
            {
                Name = "Email",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "test@test.com" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "test@test.com" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Emergency Name",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Sveta T. Tester" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Sveta T. Tester" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Emergency Phone",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "7777777777" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "7777777777" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Emergency Relative",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "spouse" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "spouse" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "s" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "s" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Expire Date",
                Filter = FilterTypes.Date,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.DateIs, StartDate = new DateTime(2016,05,04) },
                    new OperationWithValues () { Type = OperationType.DateIsNot, StartDate = new DateTime(2016,05,04) },
                    new OperationWithValues () { Type = OperationType.DateMoreThan, StartDate = new DateTime(2016,05,04) },
                    new OperationWithValues () { Type = OperationType.DateLesThan, StartDate = new DateTime(2016,05,04) },
                    new OperationWithValues () { Type = OperationType.Between, StartDate = new DateTime(2016,02,04),  EndDate = new DateTime(2016,05,04)},

                }
            },

            new Field()
            {
                Name = "Gender",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Female" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Female" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Home Phone",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "1111111111" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "1111111111" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Location",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Lincare dba SleepCircle" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Lincare dba SleepCircle" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Mobile",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "1111111111" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "1111111111" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "7" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Patient Address",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "2142 E Wheat Rd, Vineland, Cumberland, NJ, 08361" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "2142 E Wheat Rd, Vineland, Cumberland, NJ, 08361" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "New York" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "New York" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },


            new Field()
            {
                Name = "Patient Address (line 1)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "2142 E Wheat Rd" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "2142 E Wheat Rd" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient Address (line 2)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "r" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "r" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient City",
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
                Name = "Patient County",
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
                Name = "Patient Creation Date",
                Filter = FilterTypes.Date,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.DateIs, StartDate = new DateTime(2016,03,31) },
                    new OperationWithValues () { Type = OperationType.DateIsNot, StartDate = new DateTime(2016,03,31) },
                    new OperationWithValues () { Type = OperationType.DateMoreThan, StartDate = new DateTime(2016,03,31) },
                    new OperationWithValues () { Type = OperationType.DateLesThan, StartDate = new DateTime(2016,03,31) },
                    new OperationWithValues () { Type = OperationType.Between, StartDate = new DateTime(2016,03,31),  EndDate = new DateTime(2016,05,04)},

                }
            },

             new Field()
            {
                Name = "Patient DOB",
                Filter = FilterTypes.Date,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.DateIs, StartDate = new DateTime(1986,01,10) },
                    new OperationWithValues () { Type = OperationType.DateIsNot, StartDate = new DateTime(1986,01,10) },
                    new OperationWithValues () { Type = OperationType.DateMoreThan, StartDate = new DateTime(1986,01,10) },
                    new OperationWithValues () { Type = OperationType.DateLesThan, StartDate = new DateTime(1986,01,10) },
                    new OperationWithValues () { Type = OperationType.Between, StartDate = new DateTime(1986,01,10),  EndDate = new DateTime(1996,01,10)},

                }
            },

              new Field()
            {
                Name = "Patient ID",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "27" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "27" },
                    new OperationWithValues () { Type = OperationType.MoreThan,  ValueToUse = "27" },
                    new OperationWithValues () { Type = OperationType.LessThan,  ValueToUse = "27" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true}

                }
            },
              new Field()
            {
                Name = "Patient Name",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Charles Rowley 03-16-1965", UseValueToCheck =true, ValueToCheck = "Charles Rowley" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Charles Rowley 03-16-1965", UseValueToCheck =true, ValueToCheck = "Charles Rowley" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Patient State",
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
                Name = "Patient ZIP Code",
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
                Name = "Plan Type",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "HMO" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "HMO" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },


              new Field()
            {
                Name = "Policy Number",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "7784512000" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "7784512000" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },
              new Field()
            {
                Name = "Practice Name",
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
                Name = "Preferred Call Time",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Morning" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Morning" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

               new Field()
            {
                Name = "Preferred Phone Type",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Home" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Home" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

               new Field()
            {
                Name = "Prefix",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Mr." },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Mr." },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

               new Field()
            {
                Name = "Primary Insurance",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "MetLife" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "MetLife" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Primary Insurance Status",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Created" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Created" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office Address",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "334 US-46, Wayne, Passaic, NJ, 07470" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "334 US-46, Wayne, Passaic, NJ, 07470" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             new Field()
            {
                Name = "Referring Phys. Office Address (line 1)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "2142 E Wheat Rd" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "2142 E Wheat Rd" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Referring Phys. Office Address (line 2)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "rd" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "r" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "r" },
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
                Name = "Referring Phys. Office Zip Code",
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
                Name = "Responsible Party",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Maria T. Tester" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Maria T. Tester" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "test" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },
             new Field()
            {
                Name = "Sales Person",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Christina  S. Barrios", UseValueToCheck = true, ValueToCheck = "Christina S. Barrios" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Christina  S. Barrios" , UseValueToCheck = true, ValueToCheck = "Christina S. Barrios"},
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

             }
        };
    }
}
