using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using System.Collections.Generic;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class VehiclesPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "//span[text()='Add Vehicle']")]
        public IWebElement AddVehicleBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Vehicles']")]
        public IWebElement VehiclesSheetName { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='filterModel.Make']")]
        public IWebElement MakeSearchField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='filterModel.Model']")]
        public IWebElement ModelSearchField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='filterModel.Year']")]
        public IWebElement YearSearchField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='filterModel.VehicleNumber']")]
        public IWebElement VinSearchField { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]/div[2]")]
        public IWebElement FirstRowMake { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]/div[3]")]
        public IWebElement FirstRowModel { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]/div[4]")]
        public IWebElement FirstRowYear { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]/div[5]")]
        public IWebElement FirstRowVin { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]/div[6]")]
        public IWebElement FirstRowEditBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//div[text()='1 - 1 of 1 items']")]
        public IWebElement CountInSheetIsOne { get; set; }

        public IList<IWebElement> VehicleList ()
        {
            return _driver.FindElements(By.XPath("*//div[contains(@class, 'vehicles-table-row vehicles-table-content')]"));
        }

        public VehiclesPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            //var isElementsDisplayed = ElementIsShown(AddVehicleBtn) && ElementIsShown(VehiclesSheetName)
            //                          && ElementIsShown(MakeSearchField) && ElementIsShown(ModelSearchField) 
            //                          && ElementIsShown(YearSearchField) && ElementIsShown(VinSearchField)
            //                          && ElementIsShown(FirstRowMake) && ElementIsShown(FirstRowModel)
            //                          && ElementIsShown(FirstRowYear) && ElementIsShown(FirstRowVin)
            //                          && ElementIsShown(FirstRowEditBtn);
            //return isElementsDisplayed;

            return ElementIsShown(AddVehicleBtn);
        }
    }

}