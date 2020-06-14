using System;
using System.Collections;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Pages;
using OpenQA.Selenium.Interactions;
using WebPortal.Selenium.Tests.Pages.Reports;

namespace Web.Selenium.SmokeTests.Tests
{
    [Parallelizable]
    public class _001_MenuItemsTest<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;

        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
        }



        [Test]
        public void Menu_000_AllMenuItemsArePresent()
        {
            var _menu = new MainMenuPage(_driver);
            _menu.WaitElementIsShown(_menu.PatientsTabBtn);
            _menu.WaitElementIsShown(_menu.DocumentsTabBtn);
            _menu.WaitElementIsShown(_menu.ReportsTabBtn);
            _menu.WaitElementIsShown(_menu.WorkflowsTabBtn);
            _menu.WaitElementIsShown(_menu.FormsTabBtn);
            _menu.WaitElementIsShown(_menu.InventoryTab);
            _menu.WaitElementIsShown(_menu.SetabTabBtn);
            _menu.WaitElementIsShown(_menu.ManagementTab);
            _menu.WaitElementIsShown(_menu.TimesheetsTab);
            Assert.IsTrue(_menu.PatientsTabBtn.Displayed);
            Assert.IsTrue(_menu.DocumentsTabBtn.Displayed);
            Assert.IsTrue(_menu.ReportsTabBtn.Displayed);
            Assert.IsTrue(_menu.WorkflowsTabBtn.Displayed);
            Assert.IsTrue(_menu.FormsTabBtn.Displayed);
            Assert.IsTrue(_menu.InventoryTab.Displayed);
            Assert.IsTrue(_menu.SetabTabBtn.Displayed);
            Assert.IsTrue(_menu.ManagementTab.Displayed);
            Assert.IsTrue(_menu.TimesheetsTab.Displayed);
        }

        [Test]
        public void Menu_001_Calendar()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.CalendarTabBtn.Click();
            SwitchToContent();
            var _calendarPage = new CalendarPage(_driver);
            _calendarPage.WaitElementIsShown(_calendarPage.NewAppointmentBtn);
            Assert.IsTrue(_calendarPage.IsDisplayed());
        }

        [Test]
        public void Menu_002_Patients()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.PatientsTabBtn.Click();
            SwitchToContent();
            var _patientGrid = new PatientsGrid(_driver);
            _patientGrid.WaitElementIsShown(_patientGrid.EditBtn);
            Assert.IsTrue(_patientGrid.IsDisplayed());

        }

        [Test]
        public void Menu_003_Documents()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.DocumentsTabBtn.Click();
            SwitchToContent();
            var _documentsPage = new DocumentsPage(_driver);
            _documentsPage.WaitElementIsShown(_documentsPage.DepartmentsRadio);

            Assert.IsTrue(_documentsPage.IsDisplayed());
        }

        [Test]
        public void Menu_004_Reports()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);
            _menu.ReportsTabBtn.Click();
            SwitchToContent();

            var _reportPage = new ReportPage(_driver);
            _reportPage.WaitElementIsShown(_reportPage.DataSourceElem);
            Assert.IsTrue(_reportPage.IsDisplayed());
        }

        [Test]
        public void Menu_005_Workflows()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.WorkflowsTabBtn.Click();
            SwitchToContent();

            var _workflowaPage = new Workflows(_driver);
            _workflowaPage.WaitElementIsShown(_workflowaPage.WorkflowForm);
            Assert.IsTrue(_workflowaPage.IsDisplayed());
        }

        [Test]
        public void Menu_006_Forms()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.FormsTabBtn.Click();
            SwitchToContent();
            var _formsPage = new Forms(_driver);
            _formsPage.WaitElementIsShown(_formsPage.Form);
            Assert.IsTrue(_formsPage.IsDisplayed());
        }
    }

    [Parallelizable]
    public class _002_MenuItemsTest<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;

        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
        }

        [Ignore ("temp ignore")]
        [Test]
        public void Menu_007_Inventory()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.OpenEquipmentPage();
            SwitchToContent();
            var _inventoryEquipmentPage = new InventoryEquipment(_driver);
            _inventoryEquipmentPage.WaitElementIsShown(_inventoryEquipmentPage.Form);
            Assert.IsTrue(_inventoryEquipmentPage.IsDisplayed());
        }

        [Test]
        public void Menu_008_Vehicles()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.OpenVehiclePage();
            SwitchToContent();
            var _vehiclesPage = new VehiclesPage(_driver);
            _vehiclesPage.WaitElementIsShown(_vehiclesPage.AddVehicleBtn);
            Assert.IsTrue(_vehiclesPage.IsDisplayed());
        }

        [Test]
        public void Menu_009_Setup()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.Click();
            SwitchToContent();
            var _setabPage = new Setup(_driver);
            _setabPage.WaitElementIsShown(_setabPage.ReferralManagementTab);
            Assert.IsTrue(_setabPage.IsDisplayed());
        }
        [Ignore ("Bug was created #15219")]
        [Test]
        public void Menu_010_Management()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.ManagementTab.Click();
            SwitchToContent();

            var _managementPage = new Management(_driver);
            _managementPage.WaitElementIsShown(_managementPage.Form);
            Assert.IsTrue(_managementPage.IsDisplayed());
        }

        [Test]
        public void Menu_011_Timesheets()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.TimesheetsTabBtn.Click();
            SwitchToContent();
            var _timesheetsPage = new Timesheets(_driver);
            _timesheetsPage.WaitElementIsShown(_timesheetsPage.Form);
            Assert.IsTrue(_timesheetsPage.IsDisplayed());
        }
    }
}
