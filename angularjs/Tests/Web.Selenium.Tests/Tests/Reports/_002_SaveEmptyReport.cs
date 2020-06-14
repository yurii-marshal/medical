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
    public class _004_SaveReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {      
        private static IEnumerable TestCasesEmpty
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
                            String.Format("_001_SaveEmptyInternalReport_{0}", list[i].DataSourceName));
                }


            }
        }

        private static IEnumerable TestCasesEmptyShared
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
                            String.Format("_001_SaveEmptySharedReport_{0}", list[i].DataSourceName));
                }


            }
        }
        

        [Test, TestCaseSource("TestCasesEmpty")]
        public void SaveEmptyReportTests(ReportModel _report)
        {
            _004_SaveInternalWithoutFiltersReport(_report);
        }

        [Test, TestCaseSource("TestCasesEmptyShared")]
        public void SaveEmptySharedReportTests(ReportModel _report)
        {
            _004_SaveSharedWithoutFiltersReport(_report);
        }
    }
}
