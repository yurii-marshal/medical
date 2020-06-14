using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class MainMenuPage : PageBase
    {
        [FindsBy(How = How.Id, Using = "calendar")]
        public IWebElement CalendarTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "patients")]
        public IWebElement PatientsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "document-management")]
        public IWebElement DocumentsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "report-management")]
        public IWebElement ReportsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "workflows-management")]
        public IWebElement WorkflowsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "print-documents")]
        public IWebElement FormsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "inventory")]
        public IWebElement InventoryTab { get; set; }

        [FindsBy(How = How.Id, Using = "management")]
        public IWebElement ManagementTab { get; set; }

        [FindsBy(How = How.Id, Using = "time-tracking")]
        public IWebElement TimesheetsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[@class='dropdown-toggle white-color menu_tooltip']")]
        public IWebElement InventoryDropdown { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[text() = 'Equipment']")]
        public IWebElement EquipmentTabBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[text() = 'Vehicles']")]
        public IWebElement VehiclesTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "setup")]
        public IWebElement SetabTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "time-tracking")]
        public IWebElement TimesheetsTabBtn { get; set; }

        [FindsBy(How = How.Id, Using = "pvChangePassword")]
        public IWebElement ChangePassBtn { get; set; }

        [FindsBy(How = How.Id, Using = "user")]
        public IWebElement UsernameText { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[@href='/home/logout']")]
        public IWebElement LogoutBtn { get; set; }

        [FindsBy(How = How.Id, Using = "menuContainer")]
        public IWebElement MenuContainer { get; set; }

        public MainMenuPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(MenuContainer);
        }

        public void OpenVehiclePage()
        {
            Actions actions = new Actions(_driver);
            actions.MoveToElement(InventoryDropdown).Click(VehiclesTabBtn).Build().Perform();
        }

        public void OpenEquipmentPage()
        {
            Actions actions = new Actions(_driver);
            actions.MoveToElement(InventoryDropdown).Click(EquipmentTabBtn).Build().Perform();
        }
    }
}