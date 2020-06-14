using System;
using System.Collections.Generic;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using WebPortal.Selenium.Tests.Common;

namespace WebPortal.Selenium.Tests.Pages
{
    public class PatientDetails : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//div[substring(@id,string-length(@id)-11)='ctr_wDetails']")]
        public IWebElement DetailsWnd { get; set; }
                
        public PatientDetails(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(DetailsWnd);
        }
    }
}