using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using OpenQA.Selenium.Support.UI;
using WebPortal.Selenium.Tests.Common;
using System.Collections.Generic;

namespace WebPortal.Selenium.Tests.Pages.Reports
{
    public class ReportPage : PageBase
    {
        [FindsBy(How = How.XPath, Using = "*//input[@aria-label='Select Data Source']")]
        public IWebElement DataSourceElem { get; set; }

        [FindsBy(How = How.XPath, Using = "*//md-virtual-repeat-container[1]")]
        public IWebElement DataSourceList { get; set; }

        [FindsBy(How = How.XPath, Using = "*//input[@aria-label='Select Filter']")]
        public IWebElement AddFilter { get; set; }

        [FindsBy(How = How.XPath, Using = "*//md-virtual-repeat-container[2]")]
        public IWebElement FilterList { get; set; }

        [FindsBy(How = How.TagName, Using = "body")]
        public IWebElement Body { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[text() = 'No data']")]
        public IWebElement NoData { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Apply']")]
        public IWebElement ApplyBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Save']")]
        public IWebElement SaveBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Save' and ancestor-or-self::div[@bs-loading-overlay-reference-id = 'save_report']]")]
        public IWebElement SaveReportBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[@bs-loading-overlay-reference-id = 'save_report']")]
        public IWebElement SaveReportDiv { get; set; }

        [FindsBy(How = How.XPath, Using = "*//input[@ng-model = 'vm.saveReportName']")]
        public IWebElement ReportName { get; set; }


        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Clear']")]
        public IWebElement ClearReportBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Edit']")]
        public IWebElement EditReportBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Delete']")]
        public IWebElement DeleteReportBtn { get; set; }

        [FindsBy(How = How.XPath, Using = "*//span[text() = 'Share for all']")]
        public IWebElement ShareReport { get; set; }


        [FindsBy(How = How.XPath, Using = "*//header[contains(., 'Data source')]")]
        public IWebElement DataSouceHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "*//header[contains(., 'Data source')]/../div/*/*/input")]
        public IWebElement DataSouceValueElem { get; set; }

        [FindsBy(How = How.XPath, Using = "*//header[contains(., 'Filters')]")]
        public IWebElement FiltersHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "*//header[contains(., 'Options')]")]
        public IWebElement OptionsHeader { get; set; }

        [FindsBy(How = How.XPath, Using = "*//div[contains(@class, 'loading_overlay')]")]
        public IWebElement LoadingOverlay { get; set; }

        public string DataSourceValue()
        {
            return DataSouceValueElem.GetAttribute("value");
        }
        public IList<IWebElement> ListOfFiltersOnSaveReportDiv()
        {
            return _driver.FindElements(By.XPath("*//div [@class = 'filter-block-wrapper']/div[@class = 'filter-row ng-scope']")); 
        }

        public string FilterValueOnSaveReportDiv(string name)
        {
            return _driver.FindElement(By.XPath(
                String.Format("*//span [text() = '{0}' and ancestor-or-self:: div[@class= 'filter-block-wrapper']]/../../../../div[2]/md-select/md-select-value/span/div", 
                name))).Text;
        }

        public IList<IWebElement> ListOfSelectedColumnsOnSaveReportDiv()
        {
            return _driver.FindElements(By.XPath("*//select[@ng-model = 'selected_columns_selected_arr' and ancestor-or-self:: div[@bs-loading-overlay-reference-id= 'save_report']]/option"));
        }

        public IWebElement SavedReportLink(string name)
        {
            return _driver.FindElement(By.XPath(String.Format("*// a[text()='{0}']", name)));
        }

        public IWebElement FilterRow (string name)
        {
            return _driver.FindElement(By.XPath(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]"));
        }


        public IWebElement InputField (string name)
        {
            return _driver.FindElement(By.XPath(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[3]/div/*/input"));
        }

        public IWebElement EndDateField(string name)
        {
            return _driver.FindElement(By.XPath(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[3]/div/md-input-container[2]/input"));
        }

        public IWebElement InputWithAutoCompleteField(string name)
        {
            Console.WriteLine(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[3]/div/*/*/*/*/*/*/input");
            return _driver.FindElement(By.XPath(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[3]/div/*/*/*/*/*/*/input"));
        }

        public IWebElement SelectFromList(string name)
        {
            
            return _driver.FindElement(By.XPath($"*//span[@title = '{name}']"));
        }

        public void SelectDataSource (string name)
        {
            _driver.FindElement(By.XPath(
                $"*//span[contains (.,'{name}') and ancestor-or-self::md-virtual-repeat-container[1]]")).Click();
        }
        public IWebElement SelectField(string name)
        {
            return _driver.FindElement(By.XPath(
                $"*//span[contains(., '{name}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[3]/div/div/md-select"));
        }

        public void SelectFromListForFilter(string name)
        {
            
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
            wait.Until( ell=> _driver.FindElements(By.XPath(
                $"*//md-select-menu/md-content/md-option/div[text()='{name}']")).Count>0);

            _driver.FindElement(By.XPath(
                $"*//div[contains(@class, '_md-clickable')]/md-select-menu/md-content/md-option/div[text()='{name}']")).Click();
        }
        public void SelectFilter(string name, int counter)
        {
            Console.WriteLine(counter);
            for (int i =0; i<counter; i++)
            AddFilter.SendKeys(Keys.ArrowDown);
            
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
            wait.Until(ell => _driver.FindElements(By.XPath(
                $"*//md-autocomplete-parent-scope/div/span[contains(text(), '{name}')]")).Count > 0);

            while (!_driver.FindElement(By.XPath($"*//*[contains(text(), '{name}')]")).Displayed)
            {
                AddFilter.SendKeys(Keys.ArrowDown);
            }
            _driver.FindElement(By.XPath($"*//md-autocomplete-parent-scope/div/span[contains(text(), '{name}')]")).Click();

        }

        public void AddAllFilters(int counter)
        {
            Console.WriteLine(counter);
            for (int i = 0; i < counter; i++)
            {
                AddFilter.SendKeys(Keys.ArrowDown);
                AddFilter.SendKeys(Keys.Enter);
            }

            
        }

        public void SelectOperation(string filter, string operation)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(7));
            wait.Until(
                ExpectedConditions.ElementToBeClickable(
                    _driver.FindElement(
                        By.XPath(
                            $"*//span[contains(., '{filter}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[2]/*/*/*/div"))));
            _driver.FindElement(By.XPath(
                $"*//span[contains(., '{filter}') and ancestor-or-self:: div[contains(@class, 'filter-row-item')] ]/../../../../div[2]/*/*/*/div")).Click();
            
            wait.Until(ExpectedConditions.ElementToBeClickable(_driver.FindElement(By.XPath(
                $"*//div [not (@aria-hidden = 'true')][contains(@class, '_md-clickable')] / md-select-menu / md-content/md-option/div[contains(., '{operation}')]"))));


            _driver.FindElement(By.XPath($"*//div [not (@aria-hidden = 'true')][contains(@class, '_md-clickable')] / md-select-menu / md-content/md-option/div[contains(., '{operation}')]")).Click();
            
        }

        public void SelectAllColumns()
        {
            int i = _driver.FindElements(By.XPath("*//select[@ng-model='available_columns_selected_arr']/option")).Count;
            while (i>0)
            {
                try
                {
                    _driver.FindElements(By.XPath("*//select[@ng-model='available_columns_selected_arr']/option"))[0].Click();
                    _driver.FindElement(By.XPath("//button[@ng-click = 'moveOptionsRight();']")).Click();

                    i--;
                }
                catch (Exception e) { }
            }
        }

        public ReportPage(IWebDriver driver) : base(driver)
        {
        }

        public override bool IsDisplayed()
        {
            return ElementIsShown(DataSourceElem);
        }
    }
}
