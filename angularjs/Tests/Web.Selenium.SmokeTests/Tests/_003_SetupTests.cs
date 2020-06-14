using System;
using System.Collections;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using WebPortal.Selenium.Tests.Tests;
using WebPortal.Selenium.Tests.Pages;

namespace Web.Selenium.SmokeTests.Tests
{
    public static class Extensions
    {
        public static void ClickEl(this IWebElement elem)
        {
            try
            {
                elem.Click();
            }           
            catch (Exception e)
            {
                elem.Click();
            }
        }
    }

    [Ignore ("temp igore SetupTests")]
    [Parallelizable]
    public class _003_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;

        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }


        [Test]
        public void _001_RefMenegament_Practices()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PracticesTab));

            _setup.PracticesTab.ClickEl();
            WaitElementIsShown(_setup.PracticeGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.PracticeGrid));
        }

        [Test]
        public void _002_RefMenegament_RefPhys()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ReferringPhysiciansTab));

            _setup.ReferringPhysiciansTab.ClickEl();
            WaitElementIsShown(_setup.RefPhysiciansGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.RefPhysiciansGrid));
        }

        [Test]
        public void _003_RefMenegament_PracticeInformation()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PracticeInformationTab));

            _setup.PracticeInformationTab.ClickEl();
            WaitElementIsShown(_setup.PracticeInformationGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.PracticeInformationGrid));
        }

        [Test]
        public void _004_RefMenegament_RefOfficeSpeciality()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ReferredOfficeSpecialityTab));

            _setup.ReferredOfficeSpecialityTab.ClickEl();
            WaitElementIsShown(_setup.ReferredPhysicianSpecialitiesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ReferredPhysicianSpecialitiesGrid));
        }

        [Test]
        public void _005_RefMenegament_Hospitals()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.HospitalsTab));

            _setup.HospitalsTab.ClickEl();
            WaitElementIsShown(_setup.HospitalsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.HospitalsGrid));
        }

        [Test]
        public void _006_RefMenegament_EquipmentPreferences()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.EquipmentPreferencesTab));

            _setup.EquipmentPreferencesTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentPreferenceGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EquipmentPreferenceGrid));
        }

        [Test]
        public void _007_Diagnosis()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DiagnosisManagementTab));

            _setup.DiagnosisManagementTab.ClickEl();
            WaitElementIsShown(_setup.DiagnosisCodesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DiagnosisCodesTab));
            _setup.DiagnosisCodesTab.ClickEl();
            WaitElementIsShown(_setup.DiagnosisGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.DiagnosisGrid));
        }
    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _004_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }


        [Test]
        public void _008_Insurance_Companies()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceTab));

            _setup.InsuranceTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceCompaniesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceCompaniesTab));

            _setup.InsuranceCompaniesTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceCompaniesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InsuranceCompaniesGrid));
        }

        [Test]
        public void _009_Insurance_Categories()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceTab));

            _setup.InsuranceTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceCategoriesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceCategoriesTab));

            _setup.InsuranceCategoriesTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceCategoriesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InsuranceCategoriesGrid));
        }

        [Test]
        public void _010_Insurance_Insurances()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceTab));

            _setup.InsuranceTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceInsurancesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceInsurancesTab));

            _setup.InsuranceInsurancesTab.ClickEl();
            WaitElementIsShown(_setup.InsuranceOfficesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InsuranceOfficesGrid));
        }

        [Test]
        public void _011_Insurance_PlanTypes()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceTab));

            _setup.InsuranceTab.ClickEl();
            WaitElementIsShown(_setup.PlanTypesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PlanTypesTab));

            _setup.PlanTypesTab.ClickEl();
            WaitElementIsShown(_setup.InsurancePlanTypesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InsurancePlanTypesGrid));
        }
    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _010_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }
        //[Ignore ("temp ignore")]
        [Test]
        public void _012_Insurance_AuthorizationCodes()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            WaitElementIsShown(_setup.InsuranceTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InsuranceTab));

            _setup.InsuranceTab.ClickEl();
            WaitElementIsShown(_setup.AuthorizationCodesTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.AuthorizationCodesTab));

            _setup.AuthorizationCodesTab.ClickEl();
            //WaitElementIsShown(_setup.VerificationCodesGrid);
            WaitElementIsShown(_setup.AssociatedCodesListGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.VerificationCodesGrid));
            Assert.IsTrue(_setup.IsDisplayed(_setup.AssociatedCodesListGrid));
        }

        [Test]
        public void _013_PersonnelManagement_ServiceReps()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PersonnelManagementTab));

            _setup.PersonnelManagementTab.ClickEl();
            WaitElementIsShown(_setup.ServiceRepsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ServiceRepsTab));

            _setup.ServiceRepsTab.ClickEl();
            WaitElementIsShown(_setup.ServiceRepsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ServiceRepsGrid));
        }

        [Ignore ("temp ignore")]
        [Test]
        public void _014_PersonnelManagement_PersonnelTags()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PersonnelManagementTab));

            _setup.PersonnelManagementTab.ClickEl();
            WaitElementIsShown(_setup.PersonnelTagsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PersonnelTagsTab));

            _setup.PersonnelTagsTab.ClickEl();
            WaitElementIsShown(_setup.PersonnelTagsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.PersonnelTagsGrid));
        }

        [Test]
        public void _015_Calendar_Holidays()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CalendarTab));

            _setup.CalendarTab.ClickEl();
            WaitElementIsShown(_setup.HolidaysTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.HolidaysTab));

            _setup.HolidaysTab.ClickEl();
            WaitElementIsShown(_setup.HolidaysGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.HolidaysGrid));
        }

        [Test]
        public void _016_Users_Roles()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.UsersTab));

            _setup.UsersTab.ClickEl();
            WaitElementIsShown(_setup.RolesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.RolesTab));

            _setup.RolesTab.ClickEl();
            WaitElementIsShown(_setup.RolesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.RolesGrid));
        }

        [Test]
        public void _017_Users_Users()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.UsersTab));

            _setup.UsersTab.ClickEl();
            WaitElementIsShown(_setup.UsersUsersTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.UsersUsersTab));

            _setup.UsersUsersTab.ClickEl();
            WaitElementIsShown(_setup.UsersGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.UsersGrid));
        }

        [Test]
        public void _017_Users_Managers()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.UsersTab));

            _setup.UsersTab.ClickEl();
            WaitElementIsShown(_setup.ManagersTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ManagersTab));

            _setup.ManagersTab.ClickEl();
            WaitElementIsShown(_setup.ManagersGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ManagersGrid));
        }
        [Ignore ("temp ignore")]
        [Test]
        public void _018_Users_TimeType()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.UsersTab));

            _setup.UsersTab.ClickEl();
            WaitElementIsShown(_setup.TimeTypeTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.TimeTypeTab));

            _setup.TimeTypeTab.ClickEl();
            WaitElementIsShown(_setup.TimeTypeGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.TimeTypeGrid));
        }
    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _005_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }


        [Test]
        public void _019_Inventory_EquipmentGroups()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentGroupsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.EquipmentGroupsTab));

            _setup.EquipmentGroupsTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentGroupsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EquipmentGroupsGrid));
        }

        [Test]
        public void _020_Inventory_TherapyTypes()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.TherapyTypesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.TherapyTypesTab));

            _setup.TherapyTypesTab.ClickEl();
            WaitElementIsShown(_setup.TherapyTypesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.TherapyTypesGrid));
        }

        [Test]
        public void _021_Inventory_Manufacturers()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.ManufacturersTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ManufacturersTab));

            _setup.ManufacturersTab.ClickEl();
            WaitElementIsShown(_setup.ManufacturersGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ManufacturersGrid));
        }

        [Test]
        public void _022_Inventory_ProductDetails()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.ProductDetailsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ProductDetailsTab));

            _setup.ProductDetailsTab.ClickEl();
            WaitElementIsShown(_setup.ModelsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ModelsGrid));
        }

        [Test]
        public void _023_Inventory_EquipmentCategory()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentCategoryTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.EquipmentCategoryTab));

            _setup.EquipmentCategoryTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentCategoriesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EquipmentCategoriesGrid));
        }

        [Test]
        public void _024_Inventor_Location()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.InventoryLocationTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryLocationTab));

            _setup.InventoryLocationTab.ClickEl();
            WaitElementIsShown(_setup.InventoryLocationGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InventoryLocationGrid));
        }

        [Test]
        public void _025_Inventory_Notification()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.InventoryLevelNotificationTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryLevelNotificationTab));

            _setup.InventoryLevelNotificationTab.ClickEl();
            WaitElementIsShown(_setup.InventoryLevelNotificationGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.InventoryLevelNotificationGrid));
        }

        [Test]
        public void _026_Inventory_PurchazingInfo()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.PurchasingInformationTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PurchasingInformationTab));

            _setup.PurchasingInformationTab.ClickEl();
            WaitElementIsShown(_setup.PurchasingInfoGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.PurchasingInfoGrid));
        }

        [Test]
        public void _027_Inventory_Templates()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.InventoryTemplatesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTemplatesTab));

            _setup.InventoryTemplatesTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentTemplatesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EquipmentTemplatesGrid));
        }

        [Test]
        public void _028_Inventory_Schemas()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.LayoutSchemasTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.LayoutSchemasTab));

            _setup.LayoutSchemasTab.ClickEl();
            WaitElementIsShown(_setup.LayoutSchemesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.LayoutSchemesGrid));
        }

        [Test]
        public void _029_Inventory_Accessories()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.InventoryTab));

            _setup.InventoryTab.ClickEl();
            WaitElementIsShown(_setup.NonInventoriedAccessoryItemsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.NonInventoriedAccessoryItemsTab));

            _setup.NonInventoriedAccessoryItemsTab.ClickEl();
            WaitElementIsShown(_setup.AccessoriesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.AccessoriesGrid));
        }

    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _006_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }


        [Test]
        public void _030_Departments_DocTypes()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DepartmentsTab));

            _setup.DepartmentsTab.ClickEl();
            WaitElementIsShown(_setup.DocumentTypesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DocumentTypesTab));

            _setup.DocumentTypesTab.ClickEl();
            WaitElementIsShown(_setup.DocTypesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.DocTypesGrid));
        }

        [Test]
        public void _031_Departments_Departments()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            WaitElementIsShown(_setup.DepartmentsTab);
            Assert.IsTrue(_setup.IsDisplayed());
            
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DepartmentsTab));

            _setup.DepartmentsTab.ClickEl();
            WaitElementIsShown(_setup.DepartmentsDepartmentsTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DepartmentsDepartmentsTab));

            _setup.DepartmentsDepartmentsTab.ClickEl();
            WaitElementIsShown(_setup.DepartmentsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.DepartmentsGrid));
        }

        [Test]
        public void _032_Compliance_Templates()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            WaitElementIsShown(_setup.ComplianceTab);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ComplianceTab));

            _setup.ComplianceTab.ClickEl();
            WaitElementIsShown(_setup.ComplianceTemplateSetupTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ComplianceTemplateSetupTab));

            _setup.ComplianceTemplateSetupTab.ClickEl();
            WaitElementIsShown(_setup.ComplianceTemplatesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.ComplianceTemplatesGrid));
        }

        //[Ignore ("temp ignore")]
        [Test]
        public void _033_Compliance_DeliveryTemplates()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            WaitElementIsShown(_setup.ComplianceTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.ComplianceTab));

            _setup.ComplianceTab.ClickEl();
            WaitElementIsShown(_setup.DeliveryTemplatesTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.DeliveryTemplatesTab));

            _setup.DeliveryTemplatesTab.ClickEl();
            WaitElementIsShown(_setup.DeliveryTemplatesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.DeliveryTemplatesGrid));
        }

        [Test]
        public void _034_Centers_Organizations()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentersTab));

            _setup.CentersTab.ClickEl();
            WaitElementIsShown(_setup.OrganizationsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.OrganizationsTab));

            _setup.OrganizationsTab.ClickEl();
            WaitElementIsShown(_setup.OrganizationsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.OrganizationsGrid));
        }

        [Test]
        public void _035_Centers_Locations()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentersTab));

            _setup.CentersTab.ClickEl();
            WaitElementIsShown(_setup.LocationsTab);

            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.LocationsTab));

            _setup.LocationsTab.ClickEl();
            WaitElementIsShown(_setup.LocationsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.LocationsGrid));
        }

        [Test]
        public void _036_CentralizesSchedule_RegionSettings()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));

            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.RegionSettingsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.RegionSettingsTab));

            _setup.RegionSettingsTab.ClickEl();
            WaitElementIsShown(_setup.RegionSettingsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.RegionSettingsGrid));
        }
    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _007_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }
        [Test]
        public void _037_CentralizesSchedule_WizardParams()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));

            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.WizardParametersTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.WizardParametersTab));

            _setup.WizardParametersTab.ClickEl();
            WaitElementIsShown(_setup.WizardParamsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.WizardParamsGrid));
        }

        [Test]
        public void _038_CentralizesSchedule_AppTypeSettings()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));

            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.AppointmentTypeSettingsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.AppointmentTypeSettingsTab));

            _setup.AppointmentTypeSettingsTab.ClickEl();
            WaitElementIsShown(_setup.AppTypeGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.AppTypeGrid));
        }

        [Test]
        public void _039_CentralizesSchedule_EqGroupLevelSettings()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));

            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentGroupLevelSettingsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.EquipmentGroupLevelSettingsTab));

            _setup.EquipmentGroupLevelSettingsTab.ClickEl();
            WaitElementIsShown(_setup.EquipmentLevelsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EquipmentLevelsGrid));
        }

        [Test]
        public void _040_CentralizesSchedule_RtScheduleSettings()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            WaitElementIsShown(_setup.ReferralManagementTab);
            Assert.IsTrue(_setup.IsDisplayed());
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));
            WaitElementIsShown(_setup.CentralizedSchedulesTab);
            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.PersonnelScheduleSettingsTab);
            //wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PersonnelScheduleSettingsTab));

            _setup.PersonnelScheduleSettingsTab.ClickEl();
            WaitElementIsShown(_setup.RTScheduleGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.RTScheduleGrid));
        }

    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _008_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }
        [Test]
        public void _041_CentralizesSchedule_SetupCenters()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.CentralizedSchedulesTab));

            _setup.CentralizedSchedulesTab.ClickEl();
            WaitElementIsShown(_setup.SetupCentersTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.SetupCentersTab));

            _setup.SetupCentersTab.ClickEl();
            _setup.WaitElementIsShown(_setup.SetupCentersTab);
            Assert.IsTrue(_setup.IsDisplayed(_setup.SetupCentersGrid));
        }


        [Test]
        public void _042_Other_Icons()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.OtherTab));

            _setup.OtherTab.ClickEl();
            WaitElementIsShown(_setup.IconsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.IconsTab));

            _setup.IconsTab.ClickEl();
            _setup.WaitElementIsShown(_setup.IconsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.IconsGrid));
        }

        [Test]
        public void _043_Other_PrintDocTemplates()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.OtherTab));

            _setup.OtherTab.ClickEl();
            WaitElementIsShown(_setup.PrintDocsTemplatesTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.PrintDocsTemplatesTab));

            _setup.PrintDocsTemplatesTab.ClickEl();
            _setup.WaitElementIsShown(_setup.PrintDocTemplatesGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.PrintDocTemplatesGrid));
        }

        [Test]
        public void _044_Other_EventMailAudit()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.OtherTab));

            _setup.OtherTab.ClickEl();
            WaitElementIsShown(_setup.EventMailAuditTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.EventMailAuditTab));

            _setup.EventMailAuditTab.ClickEl();
            _setup.WaitElementIsShown(_setup.EventMailAuditGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.EventMailAuditGrid));
        }
    }

    [Ignore("temp igore SetupTests")]
    [Parallelizable]
    public class _009_SetupTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public bool logged = false;
        WebDriverWait wait;
        [SetUp]
        public void SetUp()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            Assert.IsTrue(new MainMenuPage(_driver).IsDisplayed());
            wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        }

        [Test]
        public void _045_Other_Settings()
        {
            var _menu = new MainMenuPage(_driver);
            Assert.IsTrue(_menu.MenuContainer.Displayed);

            _menu.SetabTabBtn.ClickEl();
            SwitchToContent();

            var _setup = new Setup(_driver);
            Assert.IsTrue(_setup.IsDisplayed());
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.OtherTab));
            WaitElementIsShown(_setup.OtherTab);
            _setup.OtherTab.ClickEl();
            WaitElementIsShown(_setup.SettingsTab);
            wait.Until(ExpectedConditions.ElementToBeClickable(_setup.SettingsTab));

            _setup.SettingsTab.ClickEl();
            _setup.WaitElementIsShown(_setup.SettingsGrid);
            Assert.IsTrue(_setup.IsDisplayed(_setup.SettingsGrid));
        }
    }
}
