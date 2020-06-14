using System;
using System.Collections;
using NUnit.Framework;
using OpenQA.Selenium;
using WebPortal.Selenium.Tests.Models.Reports;


namespace WebPortal.Selenium.Tests.Tests.Reports
{
    [Parallelizable]
    public class _001_ReferralManagementReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private static IEnumerable ReferralManagement
        {
            get
            {


                var RefReport = new Data().ReferralManagementReport;
                for (int i = 0; i < RefReport.FieldList.Count; i++)
                {
                    foreach (var oper in RefReport.FieldList[i].OperationsList)
                        yield return
                            new TestCaseData(RefReport.FieldList[i], oper, "Referral Management", i + 1).SetName(
                                String.Format(" ReferralManagementReport_ {0} {1}", RefReport.FieldList[i].Name, oper.Type.ToString()));
                }
            }

        }



        [Test, TestCaseSource("ReferralManagement")]
        public void ReferralTests(Field el, OperationWithValues operation, string reportName, int count)
        {
            _001_Test(el, operation, reportName, count);
        }



    }

    [Parallelizable]
    public class _004_PatientReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private static IEnumerable PatientReport
        {
            get
            {
                var PatientReport = new Data().PatientReport;
                for (int i = 0; i < PatientReport.FieldList.Count; i++)
                    foreach (var oper in PatientReport.FieldList[i].OperationsList)
                    {
                        oper.ExpectedEmptyTable = true;
                        yield return
                            new TestCaseData(PatientReport.FieldList[i], oper, "Patient", i + 1).SetName(
                                String.Format(" PatientReport_ {0} {1}", PatientReport.FieldList[i].Name, oper.Type.ToString()));
                    }


            }
        }


        [Test, TestCaseSource("PatientReport")]
        public void ReferralTests(Field el, OperationWithValues operation, string reportName, int count)
        {
            _001_Test(el, operation, reportName, count);
        }

    }

    [Parallelizable]
    public class _002_SalesHistoryReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private static IEnumerable SalesHistory
        {
            get
            {
                var SalesReport = new Data().SalesHistoryReport;
                Console.WriteLine(SalesReport.FieldList.Count);
                for (int i = 0; i < SalesReport.FieldList.Count; i++)
                    foreach (var oper in SalesReport.FieldList[i].OperationsList)
                    {
                        oper.ExpectedEmptyTable = true;
                        yield return
                            new TestCaseData(SalesReport.FieldList[i], oper, "Sales History", i + 1).SetName(
                                String.Format(" SalesHistoryReport_ {0} {1}", SalesReport.FieldList[i].Name, oper.Type.ToString()));
                    }


            }
        }

        [Test, TestCaseSource("SalesHistory")]
        public void ReferralTests(Field el, OperationWithValues operation, string reportName, int count)
        {
            _001_Test(el, operation, reportName, count);
        }

    }

    [Parallelizable]
    public class _003_EventDetailsReportTests<TWebDriver> : GeneralReportTests<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        private static IEnumerable EventDetails
        {
            get
            {


                var EvReport = new Data().EventDetailsReport;
                for (int i = 0; i < EvReport.FieldList.Count; i++)
                    foreach (var oper in EvReport.FieldList[i].OperationsList)
                    {
                        oper.ExpectedEmptyTable = true;
                        yield return
                            new TestCaseData(EvReport.FieldList[i], oper, "Event Details", i + 1).SetName(
                                String.Format(" EventDetailsReport_ {0} {1}", EvReport.FieldList[i].Name, oper.Type.ToString()));
                    }


            }
        }

        [Test, TestCaseSource("EventDetails")]
        public void ReferralTests(Field el, OperationWithValues operation, string reportName, int count)
        {
            _001_Test(el, operation, reportName, count);
        }



    }

}
