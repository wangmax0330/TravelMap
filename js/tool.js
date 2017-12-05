 /**
     * [meter2Kilo 米转公里]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    var meter2Kilo = function(value) {
        return (value > 1000) ? ((value / 1000) + "公里") : (value + "米");
    };
    /**
     * [StringUtils 非空判断]
     * @type {Object}
     */
    var StringUtils = {
        isEmpty: function(input) {
            return input == null || input == '';
        },
        isNotEmpty: function(input) {
            return !this.isEmpty(input);
        },
        isBlank: function(input) {
            return input == null || /^\s*$/.test(input);
        },
        isNotBlank: function(input) {
            return !this.isBlank(input);
        },
    };

    /**
     * [showWarningAlert 弹出警告框]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    var showWarningAlert = function(message) {
        var warning_alert = $("#alert-warning");
        warning_alert.html("<strong>警告！</strong>"+message);
        warning_alert.show().delay(3000).fadeOut();
    };


    var showSuccessAlert = function(message) {
        var success_alert = $("#alert-success");
        success_alert.html("<strong>成功！</strong>"+message);
        success_alert.show().delay(3000).fadeOut();
    };
     var showErrorAlert = function(message) {
        var error_alert = $("#alert-error");
        error_alert.html("<strong>错误！</strong>"+message);
        error_alert.show().delay(3000).fadeOut();
    };