using NUnit.Framework;
using OpenQA.Selenium;
using WebPortal.Selenium.Tests.Pages;

namespace WebPortal.Selenium.Tests.Tests
{
    public class _003_CalendarTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        [Test]
        public void _301_FirstLoginMonthViewIsSelected()
        {
            Login();
            CalendarPage calendar = new CalendarPage(_driver);
            calendar.IsDisplayed();
            Assert.AreEqual(calendar.GetCurrentMonth(), calendar.CalendarTitle.Text);
        }
    }
}