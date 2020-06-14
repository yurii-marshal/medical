﻿using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class Forms : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//form[@action = 'print']")]
        public IWebElement Form { get; set; }

        public Forms(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(Form);
        }
    }
}