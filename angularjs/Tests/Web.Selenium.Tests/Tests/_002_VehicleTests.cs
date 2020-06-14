using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using WebPortal.Selenium.Tests.Common;
using WebPortal.Selenium.Tests.Models;
using WebPortal.Selenium.Tests.Pages;
using OpenQA.Selenium.Support.UI;
using System;

namespace WebPortal.Selenium.Tests.Tests
{
    public class _002_VehicleTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private MainMenuPage mainMenu;
        private VehiclesPage vehiclePage;
        private AddEditNewVehiclePage addNewVehiclePage;
        private VehicleModel vehicle;
        public bool logged = false;

        [SetUp]        
        public void  OpenVehicles()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }
            mainMenu = new MainMenuPage(_driver);
            Assert.IsTrue(mainMenu.MenuContainer.Displayed);
            SwitchToContent();
            Assert.IsTrue(new CalendarPage(_driver).IsDisplayed());
            SwitchToParent();

            mainMenu.OpenVehiclePage();
            SwitchToContent();


            vehiclePage = new VehiclesPage(_driver);
            Assert.IsTrue(vehiclePage.IsDisplayed());

            


        }

        [Test]
        public void _002_OpenVehicleTab()
        {
            

            Assert.IsTrue(vehiclePage.IsDisplayed());
        }

        [Test]
        public void _201_AddNewVehicle()
        {
            vehiclePage.AddVehicleBtn.Click();
            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            vehicle = new VehicleModel();

            addNewVehiclePage.MakeInputField.SendKeys(vehicle.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicle.Year);
            addNewVehiclePage.VinInputField.SendKeys(vehicle.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicle.Descriptopn);

            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(vehiclePage.IsDisplayed());

            vehiclePage.MakeSearchField.SendKeys(vehicle.Make);
            vehiclePage.ModelSearchField.SendKeys(vehicle.Model);
            vehiclePage.YearSearchField.SendKeys(vehicle.Year);
            vehiclePage.VinSearchField.SendKeys(vehicle.Vin);

            //wait to show searchResult
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
            wait.Until(dr => vehiclePage.VehicleList().Count == 1);

            //check added vehicle is contains in sheet
            Assert.AreEqual(vehicle.Make, vehiclePage.FirstRowMake.Text);
            Assert.AreEqual(vehicle.Model, vehiclePage.FirstRowModel.Text);
            Assert.AreEqual(vehicle.Year, vehiclePage.FirstRowYear.Text);
            Assert.AreEqual(vehicle.Vin, vehiclePage.FirstRowVin.Text);
        }

        [Test]
        public void _202_AddVehicleWithDublicateVin()
        {
            vehiclePage.AddVehicleBtn.Click();
            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            vehicle = new VehicleModel();

            addNewVehiclePage.MakeInputField.SendKeys(vehicle.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicle.Year);
            addNewVehiclePage.VinInputField.SendKeys(vehicle.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicle.Descriptopn);

            addNewVehiclePage.SaveBtn.Click();

            vehiclePage.AddVehicleBtn.Click();
            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            

            addNewVehiclePage.MakeInputField.SendKeys(vehicle.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicle.Year);
            addNewVehiclePage.VinInputField.SendKeys(vehicle.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicle.Descriptopn);

            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinError));
            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinErrorMessage));
            Assert.AreEqual("The vehicle with the same VIN already exists.",
                addNewVehiclePage.ValidatioinErrorMessage.Text);

            addNewVehiclePage.VehiclesTabLink.Click();
        }

        [Test]
        public void _203_AddVehicleWithVinIsNot17Char()
        {
            vehiclePage.AddVehicleBtn.Click();

            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            vehicle = new VehicleModel();

            addNewVehiclePage.MakeInputField.SendKeys(vehicle.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicle.Year);
            addNewVehiclePage.VinInputField.SendKeys(vehicle.VinIsNot17Char);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicle.Descriptopn);

            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinError));
            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinErrorMessage));
            Assert.AreEqual("VIN must consist of 17 alphanumeric characters.",
                addNewVehiclePage.ValidatioinErrorMessage.Text);

            addNewVehiclePage.VehiclesTabLink.Click();
        }

        [Test]
        public void _204_AddVehicleWithYearLess1900()
        {
            vehiclePage.IsDisplayed();

            VehicleModel vehicleForYear = new VehicleModel();

            vehiclePage.AddVehicleBtn.Click();

            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

           
            addNewVehiclePage.MakeInputField.SendKeys(vehicleForYear.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicleForYear.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicleForYear.YearLs1900);
            addNewVehiclePage.VinInputField.SendKeys(vehicleForYear.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicleForYear.Descriptopn);
           
            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinError));
            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinErrorMessage));
            Assert.AreEqual("'Year' must be greater than '1900'.", addNewVehiclePage.ValidatioinErrorMessage.Text);

            addNewVehiclePage.VehiclesTabLink.Click();
        }

        [Test]
        public void _205_AddVehicleWithYearCreater2016()
        {
            vehiclePage.IsDisplayed();

            VehicleModel vehicleForYear = new VehicleModel();

            vehiclePage.AddVehicleBtn.Click();

            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            
            addNewVehiclePage.MakeInputField.SendKeys(vehicleForYear.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicleForYear.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicleForYear.YearGr2016);
            addNewVehiclePage.VinInputField.SendKeys(vehicleForYear.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicleForYear.Descriptopn);
            
            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinError));
            Assert.IsTrue(addNewVehiclePage.ElementIsShown(addNewVehiclePage.ValidatioinErrorMessage));
            Assert.AreEqual("'Year' must be less than or equal to '2016'.", addNewVehiclePage.ValidatioinErrorMessage.Text);

            addNewVehiclePage.VehiclesTabLink.Click();
        }

        [Test]
        public void _206_EditVehicle()
        {
            vehiclePage.IsDisplayed();

            vehiclePage.AddVehicleBtn.Click();
            addNewVehiclePage = new AddEditNewVehiclePage(_driver);
            Assert.IsTrue(addNewVehiclePage.IsDisplayed());

            vehicle = new VehicleModel();

            addNewVehiclePage.MakeInputField.SendKeys(vehicle.Make);
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.Model);
            addNewVehiclePage.YearInputField.SendKeys(vehicle.Year);
            addNewVehiclePage.VinInputField.SendKeys(vehicle.Vin);
            addNewVehiclePage.DescriptionInputField.SendKeys(vehicle.Descriptopn);

            addNewVehiclePage.SaveBtn.Click();

            //find created vehicle
            vehiclePage.MakeSearchField.SendKeys(vehicle.Make);
            vehiclePage.ModelSearchField.SendKeys(vehicle.Model);
            vehiclePage.YearSearchField.SendKeys(vehicle.Year);
            vehiclePage.VinSearchField.SendKeys(vehicle.Vin);

            //wait to show searchResult
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
            wait.Until(dr => vehiclePage.VehicleList().Count == 1);

            vehiclePage.FirstRowEditBtn.Click();

            addNewVehiclePage.MakeInputField.Clear();
            addNewVehiclePage.MakeInputField.SendKeys(vehicle.MakeEdited);
            addNewVehiclePage.ModelInputField.Clear();
            addNewVehiclePage.ModelInputField.SendKeys(vehicle.ModelEdited);
            addNewVehiclePage.YearInputField.Clear();
            addNewVehiclePage.YearInputField.SendKeys(vehicle.YearEdited);

            addNewVehiclePage.SaveBtn.Click();

            Assert.IsTrue(vehiclePage.IsDisplayed());

            vehiclePage.MakeSearchField.SendKeys(vehicle.MakeEdited);
            vehiclePage.ModelSearchField.SendKeys(vehicle.ModelEdited);
            vehiclePage.YearSearchField.SendKeys(vehicle.YearEdited);
            vehiclePage.VinSearchField.SendKeys(vehicle.Vin);

            //wait to show searchResult
            
            wait.Until(dr => vehiclePage.VehicleList().Count == 1);

            //check added vehicle is contains in sheet
            Assert.AreEqual(vehicle.MakeEdited, vehiclePage.FirstRowMake.Text);
            Assert.AreEqual(vehicle.ModelEdited, vehiclePage.FirstRowModel.Text);
            Assert.AreEqual(vehicle.YearEdited, vehiclePage.FirstRowYear.Text);
            Assert.AreEqual(vehicle.Vin, vehiclePage.FirstRowVin.Text);
        }

        [Test] //not ready
        public void _207_AddInspectionReport()
        {
            vehiclePage.IsDisplayed();
            vehiclePage.FirstRowVin.Click();
        }

    }
}
