using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class AddEditNewVehiclePage : PageBase
    {
        //names of fields
        [FindsBy(How = How.XPath, Using = "//label[text()='Make']")]
        public IWebElement MakeFieldName { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Year']")]
        public IWebElement YearFieldName { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Model']")]
        public IWebElement ModelFieldName { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='VIN']")]
        public IWebElement VinFieldName { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Description']")]
        public IWebElement DescriptionFieldName { get; set; }

        //input fields
        [FindsBy(How = How.XPath, Using = "//input[@ng-model='vehicle.Make']")]
        public IWebElement MakeInputField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='vehicle.Year']")]
        public IWebElement YearInputField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='vehicle.Model']")]
        public IWebElement ModelInputField { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@ng-model='vehicle.VehicleNumber']")]
        public IWebElement VinInputField { get; set; }

        [FindsBy(How = How.XPath, Using = "//textarea[@ng-model='vehicle.Description']")]
        public IWebElement DescriptionInputField { get; set; }

        //Buttons
        [FindsBy(How = How.XPath, Using = "//span[text()='Save']")]
        public IWebElement SaveBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='Cancel']")]
        public IWebElement CancelBtn { get; set; }

        //Validation messages
        [FindsBy(How = How.XPath, Using = "//label[text()='Validation Errors']")]
        public IWebElement ValidatioinError { get; set; }

        [FindsBy(How = How.XPath, Using = "//div[4]//li")]
        public IWebElement ValidatioinErrorMessage { get; set; }

        //link to return on Vehicles tab
        [FindsBy(How = How.XPath, Using = "//a[@href='#/inventory/vehicles']")]
        public IWebElement VehiclesTabLink { get; set; }

        public AddEditNewVehiclePage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            var isElementsDisplayed = ElementIsShown(MakeFieldName) && ElementIsShown(YearFieldName) && ElementIsShown(ModelFieldName) 
                && ElementIsShown(VinFieldName) && ElementIsShown(DescriptionFieldName) && ElementIsShown(MakeInputField) &&
                ElementIsShown(YearInputField) && ElementIsShown(ModelInputField) && ElementIsShown(VinInputField)
                && ElementIsShown(DescriptionInputField) && ElementIsShown(SaveBtn) && ElementIsShown(CancelBtn);

            return isElementsDisplayed;
        }
    }
}