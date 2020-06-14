using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;

namespace WebPortal.Selenium.Tests.Common
{
    public class InitDrivers
    {
       
        private FirefoxDriver InitializeFirefoxDriver()
        {
            FirefoxProfile profile = new FirefoxProfile();
            var driver = new FirefoxDriver(profile);
            return driver;
        }

        private InternetExplorerDriver InitializeIEDriver()
        {
            var service = InternetExplorerDriverService.CreateDefaultService();
            
            
            var driver = new InternetExplorerDriver(service,
                new InternetExplorerOptions
                {
                    EnsureCleanSession = true,
                    IgnoreZoomLevel = true,
                    IntroduceInstabilityByIgnoringProtectedModeSettings = true,
                    EnableNativeEvents = false
                });
            
            return driver;
        }

        private ChromeDriver InitializeChromeDriver()
        {
            var driver = new ChromeDriver();
            return driver;
        }


        public IWebDriver InitDriver(Type type)
        {
            IWebDriver driver = null;
            
            Console.WriteLine("Initialize {0}", type);

            if (type == typeof(ChromeDriver))
                driver = InitializeChromeDriver();
            else if (type == typeof(FirefoxDriver))
                driver = InitializeFirefoxDriver();
            else if (type == typeof(InternetExplorerDriver))
                driver = InitializeIEDriver();
            else
                Console.WriteLine("Error");


            driver.Manage().Timeouts()
               .SetPageLoadTimeout(TimeSpan.FromMinutes(1))
               .SetScriptTimeout(TimeSpan.FromSeconds(90))
               .ImplicitlyWait(TimeSpan.FromSeconds(90));

            return driver;
        }
    }
}
