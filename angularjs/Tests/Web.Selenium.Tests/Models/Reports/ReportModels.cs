using System;
using System.Collections.Generic;

namespace WebPortal.Selenium.Tests.Models.Reports
{
    public enum FilterTypes
    {
        Input,
        AutoComplete,
        Date,
        Select
    }

    public enum OperationType
    {
        Is,
        IsNot,
        Contains,
        DoesntContain,
        None,
        DateMoreThan,
        DateLesThan,
        Between,
        DateIs,
        DateIsNot,
        MoreThan,
        LessThan
    }

    public class OperationWithValues
    {
        public OperationType Type;
        public string ValueToUse;
        public bool ExpectedEmptyTable = false;
        public string ValueToCheck;
        public bool UseValueToCheck = false;

        public DateTime StartDate;
        public DateTime EndDate;
    }
    public class Field
    {
        public string Name;
        public IList<OperationWithValues> OperationsList = new List<OperationWithValues>();
        public FilterTypes Filter;

    }

    public class ReportModel
    {
        public string DataSourceName;
        public string SavedReportName;
        public IList<Field> FieldList = new List<Field>();
    }


}
