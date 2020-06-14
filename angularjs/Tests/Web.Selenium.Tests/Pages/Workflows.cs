using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class Workflows : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//form[contains(@action, 'drowz.net/old/reports')]")]
        public IWebElement WorkflowForm { get; set; }

        public Workflows(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(WorkflowForm);
        }
    }
}