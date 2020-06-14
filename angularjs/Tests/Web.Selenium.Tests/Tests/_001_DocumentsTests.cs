using System;
using NUnit.Framework;
using OpenQA.Selenium;
using WebPortal.Selenium.Tests.Common;
using WebPortal.Selenium.Tests.Pages;

namespace WebPortal.Selenium.Tests.Tests
{
    public class _001_DocumentsTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        [Test]
        public void _001_Login()
        {
            Login();
            MainMenuPage mainMenu = new MainMenuPage(_driver);
            String userName = mainMenu.UsernameText.Text;
            Assert.AreEqual((EnvironmentUtils.GetConfigSettingStr(DrowzKeys.UserName)), userName);
            TearDown();
        }
    }
}
