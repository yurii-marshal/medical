using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class DocumentsPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//label[text() = 'Departments']/..")]
        public IWebElement DepartmentsRadio { get; set; }

        [FindsBy(How = How.XPath, Using = "*//label[text() = 'Upload Files']/..")]
        public IWebElement UploadFileRadio { get; set; }

        public DocumentsPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(DepartmentsRadio);
        }
    }
}
