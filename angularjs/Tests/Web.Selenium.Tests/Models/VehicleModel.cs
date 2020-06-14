using System;

namespace WebPortal.Selenium.Tests.Models
{
    public class VehicleModel
    {
        public string Make { get; set; }
        public string MakeEdited { get; set; }
        public string Model { get; set; }
        public string ModelEdited { get; set; }
        public string Year { get; set; }
        public string YearEdited { get; set; }
        public string YearLs1900 { get; set; }
        public string YearGr2016 { get; set; }
        public string Vin { get; set; }
        public string VinIsNot17Char { get; set; }
        public string Descriptopn { get; set; }

        public VehicleModel()
        {
            Random random = new Random();
            string stringBuilder = "";
            for (int i = 0; i < 17; i++)
            {
                stringBuilder = stringBuilder + random.Next(9).ToString();
            }
            Vin = stringBuilder;

            Make = "Ford";
            MakeEdited = "Opel";
            Model = "Transit";
            ModelEdited = "Corsa";
            Year = "1998";
            YearEdited = "2010";
            YearLs1900 = "1800";
            YearGr2016 = "2020";
            VinIsNot17Char = "1234567890sdfsdf";
            Descriptopn = "addByAutoTestVehicle";
        }
    }
}