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
        private ReportPage OpenReports()
        {
            _driver.Navigate().Refresh();
            if (_driver.Url.Contains("login") || !logged)
            {
                Login();
                logged = true;
            }

            var _mainMenu = new MainMenuPage(_driver);
            _mainMenu.ReportsTabBtn.Click();
            SwitchToContent();

            var _reportPage = new ReportPage(_driver);
            Assert.IsTrue(_reportPage.IsDisplayed());

            _reportPage.Body.Click();
            return _reportPage;
        }

        private bool ColumnContains(string val, string column)
        {
            Console.WriteLine("ColumnIs");

            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));
            IList<string> names = new List<string>();
            foreach (var el in list.AsParallel())
            {
                Console.WriteLine(el.Text);
                names.Add(el.Text);
            }
            return names.AsParallel().All(el => el.ToLower().Contains(val.ToLower()));
        }

        private bool ColumnIs(string val, string column)
        {
            Console.WriteLine("ColumnIs");
            Thread.Sleep(2000);
            var _reportPage = new ReportPage(_driver);

            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }



            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));
            IList<string> names = new List<string>();

            Console.WriteLine(list.Count);
            foreach (var el in list.AsParallel())
            {
                Console.WriteLine(el.Text);
                names.Add(el.Text);
            }
            return names.AsParallel().All(el => el.ToLower() == val.ToLower());
        }

        private bool ColumnIsNot(string val, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));
            IList<string> names = new List<string>();
            foreach (var el in list.AsParallel())
            {
                Console.WriteLine(el.Text);
                names.Add(el.Text);
            }
            return names.AsParallel().All(el => el.ToLower() != val.ToLower());
        }

        private bool ColumnNotContains(string val, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));
            IList<string> names = new List<string>();
            foreach (var el in list.AsParallel())
            {
                Console.WriteLine(el.Text);
                names.Add(el.Text);
            }
            return names.AsParallel().All(el => !el.ToLower().Contains(val.ToLower()));
        }

        private bool ColumnIsEmpty(string val, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));
            IList<string> names = new List<string>();
            foreach (var el in list.AsParallel())
            {
                Console.WriteLine(el.Text);
                names.Add(el.Text);
            }
            return names.AsParallel().All(el => (String.IsNullOrEmpty(el) || String.IsNullOrWhiteSpace(el)));
        }

        public bool DateBetween(DateTime start, DateTime end, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;
            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            bool withTime = false;
            IList<string> dates = new List<string>();
            foreach (var el in list)
                if (!String.IsNullOrWhiteSpace(el.Text))
                {
                    dates.Add(el.Text);
                    if (el.Text.Contains("AM") || el.Text.Contains("PM"))
                        withTime = true;
                }

            foreach (var el in dates)
                Console.WriteLine($"date: {el}!");

            if (withTime)
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) >= start && DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) <= end);
            return
                dates.All(el => DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) >= start
                                && DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) <= end);
        }

        public bool DateMoreThan(DateTime date, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            bool withTime = false;
            IList<string> dates = new List<string>();
            foreach (var el in list)
                if (!String.IsNullOrWhiteSpace(el.Text))
                {
                    dates.Add(el.Text);
                    if (el.Text.Contains("AM") || el.Text.Contains("PM"))
                        withTime = true;
                }

            foreach (var el in dates)
                Console.WriteLine($"date: {el}!");

            if (withTime)
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) >= date);
            return
                dates.All(el => DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) >= date);
        }

        public bool DateLessThan(DateTime date, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            bool withTime = false;
            IList<string> dates = new List<string>();
            foreach (var el in list)
                if (!String.IsNullOrWhiteSpace(el.Text))
                {
                    dates.Add(el.Text);
                    if (el.Text.Contains("AM") || el.Text.Contains("PM"))
                        withTime = true;
                }

            foreach (var el in dates)
                Console.WriteLine($"date: {el}!");

            if (withTime)
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) <= date);
            return
                dates.All(el => DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) <= date);
        }

        public bool NumberLessThan(string value, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            IList<string> dates = list.Select(el => el.Text).ToList();
            return dates.All(el => int.Parse(el) <= int.Parse(value));
        }

        public bool NumberMoreThan(string value, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            IList<string> dates = list.Select(el => el.Text).ToList();
            return dates.All(el => int.Parse(el) >= int.Parse(value));
        }

        public bool DateIs(DateTime date, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));

            bool withTime = false;
            IList<string> dates = new List<string>();
            foreach (var el in list)
                if (!String.IsNullOrWhiteSpace(el.Text))
                {
                    dates.Add(el.Text);
                    if (el.Text.Contains("AM") || el.Text.Contains("PM"))
                        withTime = true;
                }

            foreach (var el in dates)
                Console.WriteLine($"date: {el}!");

            if (withTime)
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) == date);
            else
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) == date);
        }

        public bool DateIsNot(DateTime date, string column)
        {
            var _reportPage = new ReportPage(_driver);
            if (_reportPage.NoData.Displayed)
                return false;

            var headers = _driver.FindElements(By.TagName("th"));
            int colNumber = 0;

            for (int i = 1; i <= headers.Count; i++)
            {
                if (headers[i - 1].Text == column)
                {
                    colNumber = i;
                    break;
                }
            }


            Console.WriteLine("*//table/tbody/tr/th[contains(., '{0}')]/../../td[{1}]", column, colNumber);
            IList<IWebElement> list =
                _driver.FindElements(
                    By.XPath(String.Format("*//table/tbody/tr/th[contains(., '{0}')]/../../tr/td[{1}]", column,
                        colNumber)));


            bool withTime = false;
            IList<string> dates = new List<string>();
            foreach (var el in list)
                if (!String.IsNullOrWhiteSpace(el.Text))
                {
                    dates.Add(el.Text);
                    if (el.Text.Contains("AM") || el.Text.Contains("PM"))
                        withTime = true;
                }

            foreach (var el in dates)
                Console.WriteLine($"date: {el}!");

            if (withTime)
                return dates.All(el => DateTime.ParseExact(el, "MM/dd/yy hh:mm tt", new CultureInfo("en-US").DateTimeFormat) != date);
            return
                dates.All(el => DateTime.ParseExact(el, "MM/dd/yyyy", new CultureInfo("en-US").DateTimeFormat) != date);
        }

        private bool TableIsEmpty()
        {
            var _reportPage = new ReportPage(_driver);

            return _reportPage.NoData.Displayed;
        }

        public string OperationName(OperationType operation)
        {
            string result = "";
            switch (operation)
            {
                case OperationType.Is:
                    result = "is";
                    break;
                case OperationType.IsNot:
                    result = "is not";
                    break;
                case OperationType.None:
                    result = "none";
                    break;
                case OperationType.Contains:
                    result = "contains";
                    break;
                case OperationType.DoesntContain:
                    result = "doesn`t contain";
                    break;
                case OperationType.DateMoreThan:
                    result = ">=";
                    break;
                case OperationType.DateLesThan:
                    result = "<=";
                    break;
                case OperationType.Between:
                    result = "between";
                    break;

                case OperationType.DateIs:
                    result = "is";
                    break;
                case OperationType.DateIsNot:
                    result = "is not";
                    break;
                case OperationType.MoreThan:
                    result = ">=";
                    break;
                case OperationType.LessThan:
                    result = "<=";
                    break;
                default:
                    break;
            }
            return result;

        }

        public void LogOut()
        {
            _driver.SwitchTo().ParentFrame();
            _driver.FindElement(By.XPath("*//a[@href = '/home/logout']/..")).Click();
            logged = false;
        }

        public bool logged = false;

        public void SetOperationDetails(Field el, OperationWithValues operation, ReportPage _reportPage)
        {

            if (operation.Type != OperationType.None)
            {
                switch (el.Filter)
                {
                    case FilterTypes.Input:
                        _reportPage.InputField(el.Name).Clear();
                        _reportPage.InputField(el.Name).SendKeys(operation.ValueToUse);

                        break;

                    case FilterTypes.AutoComplete:
                        _reportPage.InputWithAutoCompleteField(el.Name).Clear();
                        _reportPage.InputWithAutoCompleteField(el.Name).Click();
                        Console.WriteLine(operation.ValueToUse);
                        if (operation.ValueToUse.Length >= 4)
                            _reportPage.InputWithAutoCompleteField(el.Name).SendKeys(operation.ValueToUse.Substring(0, 4));
                        else
                            _reportPage.InputWithAutoCompleteField(el.Name).SendKeys(operation.ValueToUse);
                        _reportPage.InputWithAutoCompleteField(el.Name).Click();
                        _reportPage.SelectFromList(operation.ValueToUse).Click();

                        break;

                    case FilterTypes.Date:
                        _reportPage.InputField(el.Name).Click();
                        _reportPage.InputField(el.Name).Clear();
                        _reportPage.InputField(el.Name).SendKeys(operation.StartDate.ToString());
                        _reportPage.InputField(el.Name).SendKeys(Keys.Enter);
                        _reportPage.Body.Click();
                        if (operation.Type == OperationType.Between)
                        {
                            _reportPage.AddFilter.Click();
                            _reportPage.Body.Click();
                            _reportPage.EndDateField(el.Name).Click();
                            _reportPage.EndDateField(el.Name).Clear();
                            _reportPage.EndDateField(el.Name).SendKeys(operation.EndDate.ToString());
                            _reportPage.Body.Click();
                        }
                        _driver.FindElement(By.XPath("*//span[text() = 'Apply']")).Click();

                        break;
                    case FilterTypes.Select:
                        _reportPage.SelectField(el.Name).Click();
                        _reportPage.SelectFromListForFilter(operation.ValueToUse);
                        break;
                    default:
                        break;

                }

            }
        }

        public void CheckOperation(OperationWithValues operation, Field el)
        {
            switch (operation.Type)
            {
                case OperationType.Contains:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || ColumnContains(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(ColumnContains(operation.ValueToUse, el.Name));
                    break;
                case OperationType.DoesntContain:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || ColumnNotContains(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(ColumnNotContains(operation.ValueToUse, el.Name));
                    break;
                case OperationType.Is:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || ColumnIs(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(ColumnIs(operation.ValueToUse, el.Name));
                    break;
                case OperationType.IsNot:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || ColumnIsNot(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(ColumnIsNot(operation.ValueToUse, el.Name));
                    break;
                case OperationType.None:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || ColumnIsEmpty(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(ColumnIsEmpty(operation.ValueToUse, el.Name));
                    break;
                case OperationType.DateMoreThan:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || DateMoreThan(operation.StartDate, el.Name));
                    else
                        Assert.IsTrue(DateMoreThan(operation.StartDate, el.Name));
                    break;
                case OperationType.DateLesThan:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || DateLessThan(operation.StartDate, el.Name));
                    else
                        Assert.IsTrue(DateLessThan(operation.StartDate, el.Name));
                    break;
                case OperationType.Between:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || DateBetween(operation.StartDate, operation.EndDate, el.Name));
                    else
                        Assert.IsTrue(DateBetween(operation.StartDate, operation.EndDate, el.Name));
                    break;
                case OperationType.DateIs:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || DateIs(operation.StartDate, el.Name));
                    else
                        Assert.IsTrue(DateIs(operation.StartDate, el.Name));
                    break;
                case OperationType.DateIsNot:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || DateIsNot(operation.StartDate, el.Name));
                    else
                        Assert.IsTrue(DateIsNot(operation.StartDate, el.Name));
                    break;
                case OperationType.MoreThan:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || NumberMoreThan(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(NumberMoreThan(operation.ValueToUse, el.Name));
                    break;
                case OperationType.LessThan:
                    if (operation.ExpectedEmptyTable)
                        Assert.IsTrue(TableIsEmpty() || NumberLessThan(operation.ValueToUse, el.Name));
                    else
                        Assert.IsTrue(NumberLessThan(operation.ValueToUse, el.Name));
                    break;
                default:
                    break;
            }
        }

        public void WaitLoadinOverlayIsNotShown(ReportPage _reportPage)
        {
            try
            {
                WaitElementIsNotShown(_reportPage.LoadingOverlay);
            }
            catch (Exception e) { }
        }
    }
}
