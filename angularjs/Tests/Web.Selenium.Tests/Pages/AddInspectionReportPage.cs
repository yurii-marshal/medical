using DrowzSeleniumTests.Common;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;

namespace DrowzSeleniumTests.Pages
{
    public class AddInspectionReportPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "//li[text()='New daily inspection report:']")]
        public IWebElement NewDailyInspectionReportHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//div/p[contains(text(),'Please select items have been inspected.')]")]
        public IWebElement PleaseSelectItemsText { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Headlights']")]
        public IWebElement HeadlightsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='4-Way Flashers']")]
        public IWebElement _4_WayFlashersCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Horn']")]
        public IWebElement HornCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Water']")]
        public IWebElement WaterCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Air Conditioner']")]
        public IWebElement AirConditionerCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Windows']")]
        public IWebElement WindowsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Tire Pressure']")]
        public IWebElement TirePressureCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Accident Damage (note in Remarks)']")]
        public IWebElement AccidentDamageCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Tail Lights']")]
        public IWebElement TailLightsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Reflectors']")]
        public IWebElement ReflectorsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Wipers']")]
        public IWebElement WipersCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Defroster']")]
        public IWebElement DefrosterCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Foot Brakes']")]
        public IWebElement FootBrakesCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Tires']")]
        public IWebElement TiresCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Equipment Secured']")]
        public IWebElement EquipmentSecuredCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Placards and Decals']")]
        public IWebElement PlacardsAndDecalsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Brake Lights']")]
        public IWebElement BrakeLightsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Mirrors']")]
        public IWebElement MirrorsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Oil']")]
        public IWebElement OilCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Heater']")]
        public IWebElement HeaterCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Parking Brake']")]
        public IWebElement ParkingBrakeCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Wheels and Rims']")]
        public IWebElement WheelsAndRimsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Steering']")]
        public IWebElement SteeringCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='SAFETY EQUIPMENT:']")]
        public IWebElement SafetyEquipmentHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Fire Extinguishers']")]
        public IWebElement FireExtinguishersCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Emergency Warning Triangel']")]
        public IWebElement EmergencyWarningTriangelCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Gloves']")]
        public IWebElement GlovesCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Warning Signs']")]
        public IWebElement WarningSignsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Backing Alarm']")]
        public IWebElement BackingAlarmCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='First Aid Kit']")]
        public IWebElement FirstAidKitCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Faceshield']")]
        public IWebElement FaceshieldCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Hearing Protectors']")]
        public IWebElement HearingProtectorsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Vehicle Markings']")]
        public IWebElement VehicleMarkingsCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-checkbox[@aria-label='Rear Obstacle Sensor System']")]
        public IWebElement RearObstacleSensorSystemCheckbox { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='REMARKS (describe defects here)']")]
        public IWebElement RemarksHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//textarea[@ng-model='inspection.Description']")]
        public IWebElement RemarksTextArea { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-radio-button[@aria-label='Condition of the above vehicle is Satisfactory']")]
        public IWebElement SatisfactoryRadioBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//md-radio-button[@aria-label='Condition of the above vehicle is Unsatisfactory']")]
        public IWebElement UnsatisfactoryRadioBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//button[@ng-click='save()']")]
        public IWebElement SaveBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//button[@ng-click='cancel()']")]
        public IWebElement CancelBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "")]
        public IWebElement Checkbox { get; set; }

        public AddInspectionReportPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            var isElementsDisplayed = ElementIsShown(NewDailyInspectionReportHeader) && ElementIsShown(PleaseSelectItemsText) && ElementIsShown(HeadlightsCheckbox) 
                                      && ElementIsShown(_4_WayFlashersCheckbox) && ElementIsShown(HornCheckbox) && ElementIsShown(WaterCheckbox)
                                      && ElementIsShown(AirConditionerCheckbox) && ElementIsShown(WindowsCheckbox) && ElementIsShown(TirePressureCheckbox)
                                      && ElementIsShown(AccidentDamageCheckbox) && ElementIsShown(TailLightsCheckbox) && ElementIsShown(ReflectorsCheckbox)
                                      && ElementIsShown(WipersCheckbox) && ElementIsShown(DefrosterCheckbox) && ElementIsShown(FootBrakesCheckbox)
                                      && ElementIsShown(TiresCheckbox) && ElementIsShown(EquipmentSecuredCheckbox) && ElementIsShown(PlacardsAndDecalsCheckbox)
                                      && ElementIsShown(BrakeLightsCheckbox) && ElementIsShown(MirrorsCheckbox) && ElementIsShown(OilCheckbox)
                                      && ElementIsShown(HeaterCheckbox) && ElementIsShown(ParkingBrakeCheckbox) && ElementIsShown(WheelsAndRimsCheckbox)
                                      && ElementIsShown(SteeringCheckbox);

            return isElementsDisplayed;
        }
    }
}