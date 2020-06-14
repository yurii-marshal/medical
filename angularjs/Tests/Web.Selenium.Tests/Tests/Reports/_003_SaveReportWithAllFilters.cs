using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using WebPortal.Selenium.Tests.Models.Reports;
using WebPortal.Selenium.Tests.Pages;
using WebPortal.Selenium.Tests.Pages.Reports;


namespace WebPortal.Selenium.Tests.Tests.Reports
{
    [Parallelizable]
    public class _005_SaveReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private static IEnumerable TestCases
        {
            get
            {
                var list = new List<ReportModel>();
                list.Add(new Data().ReferralManagementReport);
                //list.Add(new Data().EventDetailsReport);
                //list.Add(new Data().PatientReport);                
                //list.Add(new Data().SalesHistoryReport);

                for (int i = 0; i < list.Count; i++)
                {
                    yield return
                        new TestCaseData(list[i]).SetName(
                            String.Format("_001_SaveInternalReport_{0}", list[i].DataSourceName));
                }


            }
        }

        private static IEnumerable TestCasesShared
        {
            get
            {
                var list = new List<ReportModel>();
                list.Add(new Data().ReferralManagementReport);
                //list.Add(new Data().EventDetailsReport);
                //list.Add(new Data().PatientReport);                
                //list.Add(new Data().SalesHistoryReport);

                for (int i = 0; i < list.Count; i++)
                {
                    yield return
                        new TestCaseData(list[i]).SetName(
                            String.Format("_001_SaveSharedReport_{0}", list[i].DataSourceName));
                }


            }
        }

        
        [Test, TestCaseSource("TestCases")]
        public void SaveInternalReportTests(ReportModel _report)
        {
            _002_SaveInternalReport(_report);
        }

        [Test, TestCaseSource("TestCasesShared")]
        public void SaveSharedReportTests(ReportModel _report)
        {
            _003_SaveSharedReport(_report);
        }
        
    }
}
