using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using WebPortal.Selenium.Tests.Common;
using WebPortal.Selenium.Tests.Pages;

namespace WebPortal.Selenium.Tests.Tests
{
    public class TestBase<TWebDriver> : SetupBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        
        public void Login()
        {
            var _loginPage = new LoginPage(_driver, DrowzKeys.LoginPage);
            
                Assert.IsTrue(_loginPage.IsDisplayed(), "Failed to display login page");
                _loginPage.UserName.SendKeys(EnvironmentUtils.GetConfigSettingStr(DrowzKeys.UserName));
                _loginPage.Password.SendKeys(EnvironmentUtils.GetConfigSettingStr(DrowzKeys.Password));

                _loginPage.LoginBtn.Click();
           
        }

        public void LoginAdditional()
        {
            var _loginPage = new LoginPage(_driver, DrowzKeys.LoginPage);

            Assert.IsTrue(_loginPage.IsDisplayed(), "Failed to display login page");
            _loginPage.UserName.SendKeys(EnvironmentUtils.GetConfigSettingStr(DrowzKeys.UserNameAdditional));
            _loginPage.Password.SendKeys(EnvironmentUtils.GetConfigSettingStr(DrowzKeys.PasswordAdditional));

            _loginPage.LoginBtn.Click();

        }


        public void SwitchToParent()
        {
            _driver.SwitchTo().ParentFrame();
        }

        public void SwitchToContent()
        {
            _driver.SwitchTo().Frame(_driver.FindElement(By.Id("PageContent")));
        }

        public void WaitElementIsShown(IWebElement el)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(4));

            wait.Until(dr => el.Displayed);
        }

        public void WaitElementIsNotShown(IWebElement el)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(4));

            wait.Until(dr => !el.Displayed);
        }

        
    }
}
