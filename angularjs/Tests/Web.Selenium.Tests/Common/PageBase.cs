using System;
using System.Configuration;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using OpenQA.Selenium.Support.UI;

namespace WebPortal.Selenium.Tests.Common
{
    public class PageBase
    {
        public IWebDriver _driver;
        public WebDriverWait wait;

        
        public PageBase(IWebDriver driver)
        {
            this._driver = driver;

            PageFactory.InitElements(_driver, this);
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(2));
        }

        public PageBase(IWebDriver driver, string configKeyUrl) : this(driver)
        {
            Assert.IsNotNull(_driver);
            var navigation = _driver.Navigate();
            Assert.IsNotNull(navigation);
            var url = EnvironmentUtils.GetConfigSettingStr(configKeyUrl);
            Assert.IsNotNull(url);
            navigation.GoToUrl(url);
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(2));
        }

        public virtual bool IsDisplayed()
        {
            return false;
        }

        public void WaitElementIsShown(IWebElement el)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));

            wait.Until(dr => el.Displayed);

        }


        public bool ElementIsShown(IWebElement el)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));

            return wait.Until<bool>(dr => el.Displayed);

        }

        
        

    }

    public static class EnvironmentUtils
    {
        
        public static string GetConfigSettingStr(string key)
        {
            object value = ConfigurationManager.AppSettings[key];
            string result = value.ToString();
            return result;
        }

    }
}
