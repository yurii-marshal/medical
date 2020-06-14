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
    public partial class GeneralReportTests<TWebDriver> : TestBase<TWebDriver> where TWebDriver : IWebDriver, new()
    {
        public void _001_Test(Field el, OperationWithValues operation, string reportName, int count)
        {

            var _reportPage = OpenReports();
            _reportPage.DataSourceElem.Click();
            _reportPage.Body.Click();
            _reportPage.DataSourceElem.Click();
            WaitElementIsShown(_reportPage.DataSourceList);

            _reportPage.SelectDataSource(reportName);

            WaitElementIsShown(_reportPage.AddFilter);
            WaitLoadinOverlayIsNotShown(_reportPage);

            _reportPage.AddFilter.Click();

            WaitElementIsShown(_reportPage.FilterList);
            _reportPage.SelectFilter(el.Name, count);

            WaitElementIsShown(_reportPage.FilterRow(el.Name));
            _reportPage.Body.Click();
            
            _reportPage.SelectAllColumns();
            _reportPage.SelectOperation(el.Name, OperationName(operation.Type));

            Thread.Sleep(4000);
            _reportPage.Body.Click();

            SetOperationDetails(el, operation, _reportPage);

            _reportPage.Body.Click();
            _reportPage.ApplyBtn.Click();

            if (operation.UseValueToCheck)
                operation.ValueToUse = operation.ValueToCheck;
            
            Thread.Sleep(2000);

            CheckOperation(operation, el);
        }

        public void _002_SaveInternalReport(ReportModel _report)
        {
            var _reportPage = OpenReports();
            _reportPage.DataSourceElem.Click();
            _reportPage.Body.Click();
            _reportPage.DataSourceElem.Click();
            WaitElementIsShown(_reportPage.DataSourceList);

            _reportPage.SelectDataSource(_report.DataSourceName);
            WaitElementIsShown(_reportPage.AddFilter);
            WaitLoadinOverlayIsNotShown(_reportPage);

            _reportPage.AddFilter.Click();

            _reportPage.AddAllFilters(_report.FieldList.Count);
            _reportPage.Body.Click();

            var listToCheck = new List<Field>();

            foreach (var el in _report.FieldList)
            {
                var i = 1;
                _reportPage.SelectOperation(el.Name, OperationName(el.OperationsList[i].Type));
                _reportPage.Body.Click();
                try { SetOperationDetails(el, el.OperationsList[i], _reportPage); }
                catch (Exception e) { SetOperationDetails(el, el.OperationsList[i], _reportPage); }
                _reportPage.Body.Click();

                listToCheck.Add
                    (new Field()
                    {
                        Name = el.Name,
                        OperationsList = new List<OperationWithValues>()
                        {
                            new OperationWithValues()
                            {
                                Type = el.OperationsList[i].Type,
                                ValueToUse = el.OperationsList[i].ValueToUse,
                                UseValueToCheck = el.OperationsList[i].UseValueToCheck,
                                ValueToCheck = el.OperationsList[i].ValueToCheck,
                                EndDate = el.OperationsList[i].EndDate,
                                StartDate = el.OperationsList[i].StartDate,
                                ExpectedEmptyTable = el.OperationsList[i].ExpectedEmptyTable
                            }
                        }
                    });
            }

            _reportPage.SelectAllColumns();

            _reportPage.SaveBtn.Click();

            WaitElementIsShown(_reportPage.SaveReportDiv);

            var list = _reportPage.ListOfFiltersOnSaveReportDiv();
            Assert.AreEqual(listToCheck.Count, list.Count);


            foreach (var el in listToCheck)
            {
                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _reportPage.FilterValueOnSaveReportDiv( el.Name)
                    );
            }

            Assert.AreEqual(listToCheck.Count, _reportPage.ListOfSelectedColumnsOnSaveReportDiv().Count);

            var reportName = String.Format("{0} {1} internal", _report.DataSourceName, DateTime.Now.ToString("mm/dd/yyyy hh:mm"));
            _reportPage.ReportName.SendKeys(reportName);
            _reportPage.SaveReportBtn.Click();

            var savedReport = new ReportModel()
            {
                SavedReportName = reportName,
                DataSourceName = _report.DataSourceName,
                FieldList = listToCheck
            };
                


            _reportPage = OpenReports();
            
            _reportPage.SavedReportLink( savedReport.SavedReportName).Click();
            WaitElementIsShown(_reportPage.EditReportBtn);

            _reportPage.DataSouceHeader.Click();


            Assert.AreEqual(savedReport.DataSourceName, _reportPage.DataSourceValue());


            _reportPage.OptionsHeader.Click();
            Assert.AreEqual(listToCheck.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' ]/option")).Count);


            _reportPage.FiltersHeader.Click();

            foreach (var el in savedReport.FieldList)
            {
                
                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}']/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );

                CheckOperation(el.OperationsList.First(), el);
            }

            _driver.SwitchTo().ParentFrame();
            _driver.FindElement(By.XPath("*//a[@href = '/home/logout']/..")).Click();

            var _loginPage = new LoginPage(_driver);
            Assert.IsTrue(_loginPage.IsDisplayed());


            LoginAdditional();
            _reportPage = OpenReports();

            var listOfReports = _driver.FindElements(By.XPath("*//ul[@bs-loading-overlay-reference-id = 'myReports']/li/a"));
            var reportNames = new List<string>();
            foreach (var el in listOfReports)
            {
                reportNames.Add(el.Text);
                Console.WriteLine(el.Text);
            }

            Console.WriteLine("SavedReportName {0}", savedReport.SavedReportName);
            Assert.IsTrue(!reportNames.Contains(savedReport.SavedReportName));

            LogOut();
        }

        public void _003_SaveSharedReport(ReportModel _report)
        {
            var _reportPage = OpenReports();
            _reportPage.DataSourceElem.Click();
            _reportPage.Body.Click();
            _reportPage.DataSourceElem.Click();
            WaitElementIsShown(_reportPage.DataSourceList);

            _reportPage.SelectDataSource(_report.DataSourceName);
            WaitElementIsShown(_reportPage.AddFilter);
            try
            {
                WaitElementIsNotShown(_driver.FindElement(By.XPath("*//div[contains(@class, 'loading_overlay')]")));
            }
            catch (Exception e)
            {

            }

            _reportPage.AddFilter.Click();

            _reportPage.AddAllFilters(_report.FieldList.Count);
            _reportPage.Body.Click();

            var listToCheck = new List<Field>();

            foreach (var el in _report.FieldList)
            {
                var i = 1;
                _reportPage.SelectOperation(el.Name, OperationName(el.OperationsList[i].Type));
                _reportPage.Body.Click();
                SetOperationDetails(el, el.OperationsList[i], _reportPage);
                _reportPage.Body.Click();

                listToCheck.Add
                    (new Field()
                    {
                        Name = el.Name,
                        OperationsList = new List<OperationWithValues>()
                        {
                            new OperationWithValues()
                            {
                                Type = el.OperationsList[i].Type,
                                ValueToUse = el.OperationsList[i].ValueToUse,
                                UseValueToCheck = el.OperationsList[i].UseValueToCheck,
                                ValueToCheck = el.OperationsList[i].ValueToCheck,
                                EndDate = el.OperationsList[i].EndDate,
                                StartDate = el.OperationsList[i].StartDate,
                                ExpectedEmptyTable = el.OperationsList[i].ExpectedEmptyTable
                            }
                        }
                    });
            }

            _reportPage.SelectAllColumns();

           
            _reportPage.SaveBtn.Click();

            WaitElementIsShown(_reportPage.SaveReportDiv);

            var list = _driver.FindElements(By.XPath("*//div [@class = 'filter-block-wrapper']/div[@class = 'filter-row ng-scope']"));
            Assert.AreEqual(listToCheck.Count, list.Count);


            foreach (var el in listToCheck)
            {
                Console.WriteLine("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name);
                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );
            }

            Assert.AreEqual(listToCheck.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' and ancestor-or-self:: div[@bs-loading-overlay-reference-id= 'save_report']]/option")).Count);

            var reportName = String.Format("{0} {1} internal", _report.DataSourceName, DateTime.Now.ToString("mm/dd/yyyy hh:mm"));
            _reportPage.ReportName.SendKeys(reportName);
            _reportPage.ShareReport.Click();
            _reportPage.SaveReportBtn.Click();

            var savedReport = new ReportModel()
            {
                SavedReportName = reportName,
                DataSourceName = _report.DataSourceName,
                FieldList = listToCheck
            };



            _reportPage = OpenReports();

            _driver.FindElement(By.XPath(String.Format("*// a[text()='{0}']", savedReport.SavedReportName))).Click();
            WaitElementIsShown(_reportPage.EditReportBtn);

            _reportPage.DataSouceHeader.Click();


            Assert.AreEqual(savedReport.DataSourceName, _reportPage.DataSouceValueElem.GetAttribute("value"));


            _reportPage.OptionsHeader.Click();
            Assert.AreEqual(listToCheck.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' ]/option")).Count);


            _reportPage.FiltersHeader.Click();

            foreach (var el in savedReport.FieldList)
            {

                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}']/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );

                CheckOperation(el.OperationsList.First(), el);
            }

            _driver.SwitchTo().ParentFrame();
            _driver.FindElement(By.XPath("*//a[@href = '/home/logout']/..")).Click();

            var _loginPage = new LoginPage(_driver);
            Assert.IsTrue(_loginPage.IsDisplayed());


            LoginAdditional();
            _reportPage = OpenReports();

            var listOfReports = _driver.FindElements(By.XPath("*//ul[@bs-loading-overlay-reference-id = 'availableReports']/li/a"));
            var reportNames = new List<string>();
            foreach (var el in listOfReports)
            {
                reportNames.Add(el.Text);
                Console.WriteLine(el.Text);
            }
            Console.WriteLine("SavedReportName {0}", savedReport.SavedReportName);
            Assert.IsTrue(reportNames.Contains(savedReport.SavedReportName));

            LogOut();
        }

        public void _004_SaveInternalWithoutFiltersReport(ReportModel _report)
        {
            var _reportPage = OpenReports();
            _reportPage.DataSourceElem.Click();
            _reportPage.Body.Click();
            _reportPage.DataSourceElem.Click();
            WaitElementIsShown(_reportPage.DataSourceList);

            _reportPage.SelectDataSource(_report.DataSourceName);
            WaitElementIsShown(_reportPage.AddFilter);
            try
            {
                WaitElementIsNotShown(_driver.FindElement(By.XPath("*//div[contains(@class, 'loading_overlay')]")));
            }
            catch (Exception e)
            {

            }

            _reportPage.AddFilter.Click();

            
            _reportPage.Body.Click();

            var listToCheck = new List<Field>();


            _reportPage.SelectAllColumns();

            _reportPage.SaveBtn.Click();

            WaitElementIsShown(_reportPage.SaveReportDiv);

            var list = new List<IWebElement>();
            try {
                _driver.FindElements(By.XPath("*//div [@class = 'filter-block-wrapper']/div[@class = 'filter-row ng-scope']"));
            }
            catch (Exception e)  { }

            Assert.AreEqual(listToCheck.Count, list.Count);


            foreach (var el in listToCheck)
            {
                Console.WriteLine("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name);
                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );
            }

            Assert.AreEqual(_report.FieldList.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' and ancestor-or-self:: div[@bs-loading-overlay-reference-id= 'save_report']]/option")).Count);

            var reportName = String.Format("{0} {1} internal", _report.DataSourceName, DateTime.Now.ToString("mm/dd/yyyy hh:mm"));
            _reportPage.ReportName.SendKeys(reportName);
            _reportPage.SaveReportBtn.Click();

            var savedReport = new ReportModel()
            {
                SavedReportName = reportName,
                DataSourceName = _report.DataSourceName,
                FieldList = listToCheck
            };



            _reportPage = OpenReports();

            _driver.FindElement(By.XPath(String.Format("*// a[text()='{0}']", savedReport.SavedReportName))).Click();
            WaitElementIsShown(_reportPage.EditReportBtn);

            _reportPage.DataSouceHeader.Click();


            Assert.AreEqual(savedReport.DataSourceName, _reportPage.DataSouceValueElem.GetAttribute("value"));


            _reportPage.OptionsHeader.Click();
            Assert.AreEqual(_report.FieldList.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' ]/option")).Count);


            _reportPage.FiltersHeader.Click();

            foreach (var el in savedReport.FieldList)
            {

                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}']/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );

                CheckOperation(el.OperationsList.First(), el);
            }

            _driver.SwitchTo().ParentFrame();
            _driver.FindElement(By.XPath("*//a[@href = '/home/logout']/..")).Click();

            var _loginPage = new LoginPage(_driver);
            Assert.IsTrue(_loginPage.IsDisplayed());


            LoginAdditional();
            _reportPage = OpenReports();

            var listOfReports = _driver.FindElements(By.XPath("*//ul[@bs-loading-overlay-reference-id = 'myReports']/li/a"));
            var reportNames = new List<string>();
            foreach (var el in listOfReports)
            {
                reportNames.Add(el.Text);
                Console.WriteLine(el.Text);
            }

            Console.WriteLine("SavedReportName {0}", savedReport.SavedReportName);
            Assert.IsTrue(!reportNames.Contains(savedReport.SavedReportName));

            LogOut();
        }

        public void _004_SaveSharedWithoutFiltersReport(ReportModel _report)
        {
            var _reportPage = OpenReports();
            _reportPage.DataSourceElem.Click();
            _reportPage.Body.Click();
            _reportPage.DataSourceElem.Click();
            WaitElementIsShown(_reportPage.DataSourceList);

            _reportPage.SelectDataSource(_report.DataSourceName);
            WaitElementIsShown(_reportPage.AddFilter);
            try
            {
                WaitElementIsNotShown(_driver.FindElement(By.XPath("*//div[contains(@class, 'loading_overlay')]")));
            }
            catch (Exception e)
            {

            }

            _reportPage.AddFilter.Click();

            //_reportPage.AddAllFilters(_report.FieldList.Count);
            _reportPage.Body.Click();

            var listToCheck = new List<Field>();

            _reportPage.SelectAllColumns();

            _reportPage.SaveBtn.Click();

            WaitElementIsShown(_reportPage.SaveReportDiv);

            var list = new List<IWebElement>();
            try
            {
                _driver.FindElements(By.XPath("*//div [@class = 'filter-block-wrapper']/div[@class = 'filter-row ng-scope']"));
            }
            catch (Exception e) { }

            Assert.AreEqual(listToCheck.Count, list.Count);


            foreach (var el in listToCheck)
            {
                Console.WriteLine("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name);
                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );
            }

            Assert.AreEqual(_report.FieldList.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' and ancestor-or-self:: div[@bs-loading-overlay-reference-id= 'save_report']]/option")).Count);

            var x = DateTime.Now.ToString("MM/dd/yyyy hh:mm");
            var reportName = String.Format("{0} {1} shared", _report.DataSourceName,x);
            _reportPage.ReportName.SendKeys(reportName);
            _reportPage.ShareReport.Click();
            _reportPage.SaveReportBtn.Click();

            var savedReport = new ReportModel()
            {
                SavedReportName = reportName,
                DataSourceName = _report.DataSourceName,
                FieldList = listToCheck
            };



            _reportPage = OpenReports();

            _driver.FindElement(By.XPath(String.Format("*// a[text()='{0}']", savedReport.SavedReportName))).Click();
            WaitElementIsShown(_reportPage.EditReportBtn);

            _reportPage.DataSouceHeader.Click();


            Assert.AreEqual(savedReport.DataSourceName, _reportPage.DataSouceValueElem.GetAttribute("value"));


            _reportPage.OptionsHeader.Click();
            Assert.AreEqual(_report.FieldList.Count, _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' ]/option")).Count);


            _reportPage.FiltersHeader.Click();

            foreach (var el in savedReport.FieldList)
            {

                Assert.AreEqual(OperationName(el.OperationsList.First().Type),
                    _driver.FindElement(By.XPath(String.Format("*//span [text() = '{0}']/../../../../div[2]/md-select/md-select-value/span/div", el.Name))).Text
                    );

                CheckOperation(el.OperationsList.First(), el);
            }

            _driver.SwitchTo().ParentFrame();
            _driver.FindElement(By.XPath("*//a[@href = '/home/logout']/..")).Click();

            var _loginPage = new LoginPage(_driver);
            Assert.IsTrue(_loginPage.IsDisplayed());


            LoginAdditional();
            _reportPage = OpenReports();

            var listOfReports = _driver.FindElements(By.XPath("*//ul[@bs-loading-overlay-reference-id = 'availableReports']/li/a"));
            var reportNames = new List<string>();
            foreach (var el in listOfReports)
            {
                reportNames.Add(el.Text);
                Console.WriteLine(el.Text);
            }

            Console.WriteLine("SavedReportName {0}", savedReport.SavedReportName);
            Assert.IsTrue(reportNames.Contains(savedReport.SavedReportName));

            LogOut();
        }

    }


    
    
}