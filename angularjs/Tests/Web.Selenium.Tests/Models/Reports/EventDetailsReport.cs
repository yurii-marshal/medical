using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Models.Reports;

namespace WebPortal.Selenium.Tests.Tests.Reports
{
    public partial class Data
    {
        public ReportModel EventDetailsReport = new ReportModel()
        {
            DataSourceName = "Event Details",
            FieldList = new List<Field>()
        {
            new Field()
            {
                Name = "Appointment Type",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Initial" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Initial" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Delivery Method",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Direct shipment" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Direct shipment" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Effective Date",
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
                Name = "Equipment Change",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Different therapy (Clinician Required)" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Different therapy (Clinician Required)" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Equipment Maintenance",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Equipment Evaluation" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Equipment Evaluation" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Equipment Pickup Reasons",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Patient Expired" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Patient Expired" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },
             new Field()
            {
                Name = "Equipment Serial Numbers",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "1090492" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "1090492" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "DS" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "DS" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },


            new Field()
            {
                Name = "Event Address",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "334 US-46, Wayne, Passaic, New Jersey, 07470" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "334 US-46, Wayne, Passaic, New Jersey, 07470" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Event Address (line 1)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "334 US-46, Wayne" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "334 US-46" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "33" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "33" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Event Address (line 2)",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "pike" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "pike" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "3" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "3" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Event City",
                Filter = FilterTypes.Input,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Wayne" },
                    new OperationWithValues () { Type = OperationType.Contains, ValueToUse = "ay" },
                    new OperationWithValues () { Type = OperationType.DoesntContain, ValueToUse = "ay" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            //new Field()
            //{
            //    Name = "Event County",
            //    Filter = FilterTypes.AutoComplete,
            //    OperationsList = new List<OperationWithValues>()
            //    {
            //        new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Passaic" },
            //        new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Passaic" },
            //        new OperationWithValues () { Type = OperationType.None},
            //    }
            //},

            new Field()
            {
                Name = "Event Date",
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
                Name = "Event State",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "New Jersey", UseValueToCheck =true, ValueToCheck = "Nj" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "New Jersey", UseValueToCheck =true, ValueToCheck = "Nj" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Event Type",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Scheduled" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Scheduled" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

             new Field()
            {
                Name = "Event ZIP Code",
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
                Name = "Field Personnel",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "AUCOIN, ELISE ",UseValueToCheck = true, ValueToCheck = "AUCOIN, ELISE"   },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "AUCOIN, ELISE " ,UseValueToCheck = true, ValueToCheck = "AUCOIN, ELISE" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Fulfillment Request",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Sent" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Sent" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },



            new Field()
            {
                Name = "Hold Reason",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Other" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Other" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Location",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Respiratory Services LCC" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Respiratory Services LCC" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Mask Refit",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Mask Refit as per patient request" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Mask Refit as per patient request" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

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
                Name = "Order Date",
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
                Name = "Order Status",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Hold" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Hold" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Order Type",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Ultrafill" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Ultrafill" },
                    new OperationWithValues () { Type = OperationType.None},
                }
            },

            new Field()
            {
                Name = "Organization",
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
                Name = "Patient Assessment - NIOV",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient Assessment - Oxygen",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient Assessment - PAP Therapy",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient Assessment - Trilogy",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Routine Follow Up" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },

            new Field()
            {
                Name = "Patient Assessment/Follow Up",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Yes" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Yes" },
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
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "New Jersey", UseValueToCheck = true, ValueToCheck="NJ" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "New Jersey", UseValueToCheck = true, ValueToCheck="NJ" },
                    new OperationWithValues () { Type = OperationType.None, ExpectedEmptyTable = true},
                }
            },


              new Field()
            {
                Name = "Patient Status",
                Filter = FilterTypes.Select,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "Active" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "Active" },
                    new OperationWithValues () { Type = OperationType.None},
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
                Name = "Referring Phys. Office State",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "New Jersey", UseValueToCheck = true, ValueToCheck="NJ"},
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "New Jersey", UseValueToCheck = true, ValueToCheck="NJ" },
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
                Name = "Referring Physician",
                Filter = FilterTypes.AutoComplete,
                OperationsList = new List<OperationWithValues>()
                {
                    new OperationWithValues () { Type = OperationType.Is, ValueToUse = "FARIDA  ABID" , UseValueToCheck =true, ValueToCheck = "FARIDA ABID" },
                    new OperationWithValues () { Type = OperationType.IsNot, ValueToUse = "FARIDA  ABID" , UseValueToCheck =true, ValueToCheck = "FARIDA ABID" },
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