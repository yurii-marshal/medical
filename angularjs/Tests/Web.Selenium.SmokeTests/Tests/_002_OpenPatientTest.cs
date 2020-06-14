using System;
using System.Collections;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Pages;

namespace Web.Selenium.SmokeTests.Tests
{
    [Parallelizable]
    public class _002_OpenPatientTest<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
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
            var _mainManuPage = new MainMenuPage(_driver);
            WaitElementIsShown(_mainManuPage.PatientsTabBtn);
            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
        }

        [TearDown]
        public new void TearDown()
        {
            if (this._driver != null)
                _driver.Quit();
        }

        [Test]
        public void Patient_001_PatientsDetails()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.PatientsTabBtn.Click();
            SwitchToContent();

            var _patientGrid = new PatientsGrid(_driver);
            Assert.IsTrue(_patientGrid.IsDisplayed());

            _patientGrid.StatusFilter.SendKeys("Active");
            _patientGrid.StatusFilter.SendKeys(Keys.Enter);
            
            _patientGrid.FirstCell.Click();
            _patientGrid.EditBtn.Click();

            Assert.IsTrue(new PatientDetails(_driver).IsDisplayed());
        }
    }
}
