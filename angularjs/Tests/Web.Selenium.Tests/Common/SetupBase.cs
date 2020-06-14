using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace WebPortal.Selenium.Tests.Common
{
    //[TestFixture(typeof(FirefoxDriver))]
    //[TestFixture(typeof(InternetExplorerDriver))]
    [TestFixture(typeof(ChromeDriver))]

    public abstract class SetupBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool flagIgnore = true;
        public IWebDriver _driver;

        [OneTimeSetUp]
        public void TestFixtureSetup()
        {            
            Console.WriteLine("In TestFixtureSetup");
            _driver = new InitDrivers().InitDriver(typeof(TWebDriver));
            _driver.Manage().Window.Position = new Point(0, 0);
            _driver.Manage().Window.Size = new Size(Screen.PrimaryScreen.WorkingArea.Width,
                Screen.PrimaryScreen.WorkingArea.Height);
        }


        [OneTimeTearDown]
        public void TearDown()
        {

            if (this._driver != null)
                _driver.Quit();
         
        }

      
    }
}

