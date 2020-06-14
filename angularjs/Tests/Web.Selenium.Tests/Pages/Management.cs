using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using System;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class Management : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//drwz-calendar-simple[@drwz-ng-model = 'setup_center.eventSource']")]
        public IWebElement Form { get; set; }

        public Management(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            try
            {
                ElementIsShown(Form);
            }
            catch (Exception ex)
            {
                if (ex is System.Reflection.TargetInvocationException || ex is StaleElementReferenceException || ex is NoSuchElementException)
                    return ElementIsShown(Form);

                throw;
            }
            return ElementIsShown(Form);

        }
    }
}