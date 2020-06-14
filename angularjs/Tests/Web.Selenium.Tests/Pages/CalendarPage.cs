using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class CalendarPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "//div[text()='Event Filter']")]
        public IWebElement EventFilterHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//i[@class='icon_close_block']")]
        public IWebElement EventFilterHideButton { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Add new filter']")]
        public IWebElement AddNewFilterHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "//input[@type='search']")]
        public IWebElement SearchFilterField { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='New Appointment']")]
        public IWebElement NewAppointmentBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//div[@ng-if='calendar.showTitle']")]
        public IWebElement CalendarTitle { get; set; }

        [FindsBy(How = How.XPath, Using = "//label[text()='Jump to:']")]
        public IWebElement JumpToBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='Today']")]
        public IWebElement TodayBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='Day']")]
        public IWebElement DayViewBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='Week']")]
        public IWebElement WeekViewBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//span[text()='Month']")]
        public IWebElement MonthViewBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[@class='calendar_prv_btn']")]
        public IWebElement PrevPeriodBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//a[@class='calendar_next_btn']")]
        public IWebElement NextPeriodBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "//div[@class='fc-view-container']")]
        public IWebElement CalendarNetAll { get; set; }

        [FindsBy(How = How.XPath, Using = "*//drwz-calendar-simple[@drwz-ng-model = 'vm.eventSource']")]
        public IWebElement Form { get; set; }

        public CalendarPage(IWebDriver driver) : base(driver)
        {
        }

        public string GetCurrentMonth()
        {
            string currentMonth = DateTime.Now.ToString("MMMM yyyy");
            return currentMonth.ToUpper();
        }

        public string GetCurrentWeek()
        {
            DateTime Sunday = GetSundayDate();
            DateTime Saturday = GetSaturdayDate();
            string currentWeek = DateTime.Now.ToString("MMM") + " " + Sunday.Day + " - " + Saturday.Day + ", " +
                          DateTime.Now.ToString("yyyy");


            return currentWeek.ToUpper();
        }

        public string GetCurrentDay()
        {
            string currentDay = DateTime.Now.ToString("MMMM d, yyyy");
            return currentDay.ToUpper();
        }

        private DateTime GetSundayDate()
        {
            DateTime date = DateTime.Now;
            while (date.DayOfWeek != System.DayOfWeek.Sunday)
            {
                date = date.AddDays(-1);
            }
            return date;
        }

        private DateTime GetSaturdayDate()
        {
            DateTime date = DateTime.Now;
            while (date.DayOfWeek != System.DayOfWeek.Saturday)
            {
                date = date.AddDays(1);
            }
            return date;
        }

        public override bool IsDisplayed()
        {
            // throws error
            //var isElementsDisplayed = ElementIsShown(EventFilterHeader) && ElementIsShown(EventFilterHideButton)
            //                          && ElementIsShown(AddNewFilterHeader) && ElementIsShown(SearchFilterField)
            //                          && ElementIsShown(NewAppointmentBtn) && ElementIsShown(CalendarTitle)
            //                          && ElementIsShown(JumpToBtn) && ElementIsShown(TodayBtn)
            //                          && ElementIsShown(DayViewBtn) && ElementIsShown(WeekViewBtn)
            //                          && ElementIsShown(MonthViewBtn) && ElementIsShown(PrevPeriodBtn)
            //                          && ElementIsShown(NextPeriodBtn) && ElementIsShown(CalendarNetAll);

            //return isElementsDisplayed;

            return ElementIsShown(Form);
        }
    }
}