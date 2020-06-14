using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class PatientsGrid : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//form[contains(@action , 'drowz.net/old/patients')]")]
        public IWebElement PatientsForm { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_cbStatusFilter")]
        public IWebElement StatusFilter { get; set; }

        [FindsBy(How = How.XPath, Using = "*//tr/td[2]/div[contains(@class, 'x-grid3-cell-inner')]")]
        public IWebElement FirstCell { get; set; }

        [FindsBy(How = How.XPath, Using = "*//button[text()='Edit']")]
        public IWebElement EditBtn { get; set; }

        public PatientsGrid(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(PatientsForm);
        }
    }
}