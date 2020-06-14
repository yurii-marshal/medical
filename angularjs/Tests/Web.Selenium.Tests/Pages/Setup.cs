using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class Setup : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//form[contains(@action,'drowz.net/old/setup')]")]
        public IWebElement Form { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Referral Management']")]
        public IWebElement ReferralManagementTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Practices']")]
        public IWebElement PracticesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Referring Physicians']")]
        public IWebElement ReferringPhysiciansTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Practice Information']")]
        public IWebElement PracticeInformationTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Referred Office Speciality']")]
        public IWebElement ReferredOfficeSpecialityTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Hospitals']")]
        public IWebElement HospitalsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Equipment Preferences']")]
        public IWebElement EquipmentPreferencesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Office Event Notifications']")]
        public IWebElement OfficeEventNotificationsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Diagnosis Management']")]
        public IWebElement DiagnosisManagementTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Diagnosis Codes']")]
        public IWebElement DiagnosisCodesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Insurance']")]
        public IWebElement InsuranceTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Companies']")]
        public IWebElement InsuranceCompaniesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Categories']")]
        public IWebElement InsuranceCategoriesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Insurances']")]
        public IWebElement InsuranceInsurancesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Plan Types']")]
        public IWebElement PlanTypesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Authorization Codes']")]
        public IWebElement AuthorizationCodesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Personnel Management']")]
        public IWebElement PersonnelManagementTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Service Reps / Clinicians']")]
        public IWebElement ServiceRepsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Personnel Tags']")]
        public IWebElement PersonnelTagsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Calendar']")]
        public IWebElement CalendarTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Holidays']")]
        public IWebElement HolidaysTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Users']")]
        public IWebElement UsersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Roles']")]
        public IWebElement RolesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//a/span[text()='Users']")]
        public IWebElement UsersUsersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Managers']")]
        public IWebElement ManagersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Time Type']")]
        public IWebElement TimeTypeTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Inventory']")]
        public IWebElement InventoryTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Equipment Groups']")]
        public IWebElement EquipmentGroupsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Therapy Types']")]
        public IWebElement TherapyTypesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Manufacturers']")]
        public IWebElement ManufacturersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Product Details']")]
        public IWebElement ProductDetailsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Equipment Category']")]
        public IWebElement EquipmentCategoryTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Inventory Location']")]
        public IWebElement InventoryLocationTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Inventory Level Notification']")]
        public IWebElement InventoryLevelNotificationTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Purchasing Information']")]
        public IWebElement PurchasingInformationTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Templates']")]
        public IWebElement InventoryTemplatesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Layout Schemas']")]
        public IWebElement LayoutSchemasTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Non Inventoried Accessory Items']")]
        public IWebElement NonInventoriedAccessoryItemsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Departments']")]
        public IWebElement DepartmentsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Document Types']")]
        public IWebElement DocumentTypesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//a/span[text()='Departments']")]
        public IWebElement DepartmentsDepartmentsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Compliance']")]
        public IWebElement ComplianceTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Template Setup']")]
        public IWebElement ComplianceTemplateSetupTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Delivery Templates']")]
        public IWebElement DeliveryTemplatesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Centers']")]
        public IWebElement CentersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Organizations']")]
        public IWebElement OrganizationsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Locations']")]
        public IWebElement LocationsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Centralized Schedules']")]
        public IWebElement CentralizedSchedulesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Region settings']")]
        public IWebElement RegionSettingsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Wizard Parameters']")]
        public IWebElement WizardParametersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='']")]
        public IWebElement Tab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Appointment Type Settings']")]
        public IWebElement AppointmentTypeSettingsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Equipment Group Level Settings']")]
        public IWebElement EquipmentGroupLevelSettingsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Personnel Schedule Settings']")]
        public IWebElement PersonnelScheduleSettingsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Setup Centers']")]
        public IWebElement SetupCentersTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Other']")]
        public IWebElement OtherTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Icons']")]
        public IWebElement IconsTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Print Docs. Templates']")]
        public IWebElement PrintDocsTemplatesTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Event Mail Audit']")]
        public IWebElement EventMailAuditTab { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text()='Settings']")]
        public IWebElement SettingsTab { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_practices_list_ascx_Id_gpPractices")]
        public IWebElement PracticeGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_referredphysicians_list_ascx_Id_gpRefPhysicians")]
        public IWebElement RefPhysiciansGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_physicianoffices_list_ascx_Id_gpPhysicianOffices")]
        public IWebElement PracticeInformationGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_referredphysicianofficespeciality_list_ascx_Id_gpReferredPhysicianSpecialities")]
        public IWebElement ReferredPhysicianSpecialitiesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_hospitals_list_ascx_Id_gpHospitals")]
        public IWebElement HospitalsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_referredphysicianequipmentpreference_list_ascx_Id_gpEquipmentPreference")]
        public IWebElement EquipmentPreferenceGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_referredofficeeventnotifications_list_ascx_Id_gpOfficeNotifications")]
        public IWebElement OfficeNotificationsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_diagnosiscodes_list_ascx_Id_gpDiagCodes")]
        public IWebElement DiagnosisGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insurancecompanies_list_ascx_Id_gpInsuranceCompanies")]
        public IWebElement InsuranceCompaniesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insurancecategories_list_ascx_Id_gpInsuranceCategories")]
        public IWebElement InsuranceCategoriesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insuranceoffices_list_ascx_Id_gpInsuranceOffices")]
        public IWebElement InsuranceOfficesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insuranceplantypes_list_ascx_Id_gpInsurancePlanTypes")]
        public IWebElement InsurancePlanTypesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insuranceauthorizationcodes_list_ascx_Id_listVerificationCodesList_gpVerificationCodesList")]
        public IWebElement VerificationCodesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_insuranceauthorizationcodes_list_ascx_Id_listAssociatedCodesList_gpAssociatedCodesList")]
        public IWebElement AssociatedCodesListGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_physiciantags_list_ascx_Id_gpPhysicianTags")]
        public IWebElement PersonnelTagsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_physicians_list_ascx_Id_gpPhysicians")]
        public IWebElement ServiceRepsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_holidays_list_ascx_Id_gpHolidays")]
        public IWebElement HolidaysGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_userroles_list_ascx_Id_gpRoles")]
        public IWebElement RolesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_users_list_ascx_Id_gpUsers")]
        public IWebElement UsersGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_managers_list_ascx_Id_gpManagers")]
        public IWebElement ManagersGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_timetype_list_ascx_Id_gpTimeType")]
        public IWebElement TimeTypeGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentgroups_list_ascx_Id_gpEquipmentGroups")]
        public IWebElement EquipmentGroupsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_therapytypes_list_ascx_Id_gpTherapyTypes")]
        public IWebElement TherapyTypesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentmanufacturers_list_ascx_Id_gpManufacturers")]
        public IWebElement ManufacturersGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentmodels_list_ascx_Id_gpModels")]
        public IWebElement ModelsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentcategories_list_ascx_Id_gpCategories")]
        public IWebElement EquipmentCategoriesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_sites_list_ascx_Id_gpSites")]
        public IWebElement InventoryLocationGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_inventorynotifications_list_ascx_Id_gpNotifications")]
        public IWebElement InventoryLevelNotificationGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentbillcompanies_list_ascx_Id_gpEquipmentBillCompanies")]
        public IWebElement PurchasingInfoGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmenttemplates_list_ascx_Id_gpEquipmentTemplates")]
        public IWebElement EquipmentTemplatesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentlayoutschemas_list_ascx_Id_gpLayoutSchemes")]
        public IWebElement LayoutSchemesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_equipmentaccessories_list_ascx_Id_gpAccessories")]
        public IWebElement AccessoriesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_documenttypes_list_ascx_Id_gpDocTypes")]
        public IWebElement DocTypesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_departments_list_ascx_Id_gpDepartments")]
        public IWebElement DepartmentsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_complianceguide_list_ascx_Id_listTemplates_gpComplianceTemplates")]
        public IWebElement ComplianceTemplatesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_compliancedelivery_list_ascx_Id_listTemplates_gpComplianceTemplates")]
        public IWebElement DeliveryTemplatesGrid { get; set; }


        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_dmecenters_list_ascx_Id_gpSubCenters")]
        public IWebElement OrganizationsGrid { get; set; }


        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_previouscenters_list_ascx_Id_gpPrevCenters")]
        public IWebElement LocationsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_zipcodes_list_ascx_Id_gpZipCodeGroups")]
        public IWebElement RegionSettingsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_centralizedwizardparameters_default_ascx_Id_gpItems")]
        public IWebElement WizardParamsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_centralizedappointments_apptypesettinglist_ascx_Id_gpAppType")]
        public IWebElement AppTypeGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_centralizedequipmentlevels_list_ascx_Id_gpEquipmentLevels")]
        public IWebElement EquipmentLevelsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_centralizedrtsettings_centralizedrtschedulesettinglist_ascx_Id_gpRTSchedule")]
        public IWebElement RTScheduleGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_centralizedsetupcenters_setupcenterslist_ascx_Id_gpSetupCenters")]
        public IWebElement SetupCentersGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_imageuploader_list_ascx_Id_gpImages")]
        public IWebElement IconsGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_pdftemplates_list_ascx_Id_gpPdfTemplates")]
        public IWebElement PrintDocTemplatesGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_mailaudit_eventmailauditlist_ascx_Id_gpMailAudit")]
        public IWebElement EventMailAuditGrid { get; set; }

        [FindsBy(How = How.Id, Using = "ctl00_MainContent_mclLoader_pages_setup_settings_list_ascx_Id_gpSettings")]
        public IWebElement SettingsGrid { get; set; }
        
        public Setup(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(Form);
        }

        public bool IsDisplayed(IWebElement el)
        {
            return ElementIsShown(el);
        }
    }
}