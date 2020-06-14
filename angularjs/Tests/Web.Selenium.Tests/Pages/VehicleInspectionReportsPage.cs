using DrowzSeleniumTests.Common;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;

namespace DrowzSeleniumTests.Pages
{
    public class VehicleInspectionReportsPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "//li[text()='Inspection reports for VIN ']")]
        public IWebElement InspectionReportsForVinHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//button/span[text()='Add Report']")]
        public IWebElement AddReportBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//th[text()='#']")]
        public IWebElement TableHeaderNo { get; set; }

        [FindsBy(How = How.XPath, Using = "//th[text()='Date ']")]
        public IWebElement TableHeaderDate { get; set; }

        [FindsBy(How = How.XPath, Using = "//th[text()='User ']")]
        public IWebElement TableHeaderUser { get; set; }

        [FindsBy(How = How.XPath, Using = "//th[text()='Status ']")]
        public IWebElement TableHeaderStatus { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='filterModel.Date']")]
        public IWebElement TableFilterDate { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@placeholder='User']")]
        public IWebElement TableFilterUser { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-select[@ng-model='filterModel.Status']")]
        public IWebElement TableFilterStatus { get; set; }

        //Item in StatusFilterDropDownList (elements is shown after click on TableFilterStatusElement
        [FindsBy(How = How.XPath, Using = "//div[text()='Unsatisfactory']")]
        public IWebElement FilterStatusUnsatisfaction { get; set; }

        [FindsBy(How = How.XPath, Using = "//div[text()='Satisfactory']")]
        public IWebElement FilterStatusSatisfaction { get; set; }


        public VehicleInspectionReportsPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            var isElementsDisplayed = ElementIsShown(InspectionReportsForVinHeader) && ElementIsShown(AddReportBtn)
                                      && ElementIsShown(TableHeaderNo) && ElementIsShown(TableHeaderDate)
                                      && ElementIsShown(TableHeaderUser) && ElementIsShown(TableHeaderStatus)
                                      && ElementIsShown(TableFilterDate) && ElementIsShown(TableFilterUser)
                                      && ElementIsShown(TableFilterStatus);

            return isElementsDisplayed;
        }
    }
}