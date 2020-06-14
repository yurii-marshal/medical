export default function localDateTimeFilter() {
    return function(dateStr, format) {
        if (!dateStr || typeof dateStr !== 'string') { return ''; }
        if (!format || typeof format !== 'string') { format = 'MM/DD/YYYY'; }

        return moment(dateStr).format(format);
    };
}