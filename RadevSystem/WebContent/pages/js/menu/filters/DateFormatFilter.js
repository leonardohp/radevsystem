define(['index'], function (index) {

    index.register.filter('dateFormat', ['sessionContext', function (sessionContext) {
        return function (dateToFormat, customFormat) {
            var oDate = new Date(dateToFormat);
            var dateToParse = Date.today().set({
                day: oDate.getDate(),
                month: oDate.getMonth(),
                year: oDate.getFullYear()
            });
            this.formatDate = sessionContext.i18n('formatDate');
            return Date.parse(dateToParse.toDateString()).toString(this.formatDate);
        };
    }]);

});