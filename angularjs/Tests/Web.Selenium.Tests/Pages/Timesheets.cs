using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class Timesheets : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//form[contains(@action, 'drowz.net/old/timetracking')]")]
        public IWebElement Form { get; set; }

        public Timesheets(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(Form);
        }
    }
}