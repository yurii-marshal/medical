//function for prepare error message from server
function getErrorMsg(err) {

    console.error({error: 'Error send/get data from server.', response: err});

    // for forgot pass window only
    // message is shown without error codes
    if (window.location.href.indexOf("forgotpass") !== -1 && err.data) {
        return err.data;
    }

    if (err && err.status === -1){
        return "Error: No connection to the server";
    }

    if (angular.isArray(err.data)) {
        var msgArr = [];
        angular.forEach(err.data, function(item){
            msgArr.push(item.Message);
        });
        return msgArr.join('<br/>');
    }

    if (err.data.Error && angular.isArray(err.data.Error)) {
        var msgArr = [];
        angular.forEach(err.data.Error, function (item) {
            msgArr.push(item);
        });
        return msgArr.join('<br/>');
    }

    if (err.data && err.data.Message) {
        return "Error. " + err.status + "<br/>" + err.data.Message;
    }

    // this is for special error message format at change password
    if (err.data
        && Object.keys(err.data).length===1
        && angular.isArray(err.data[Object.keys(err.data)[0]])
    ) {
        var msgArr = [];
        angular.forEach(err.data[Object.keys(err.data)[0]], function(item){
            msgArr.push(item);
        });
        return msgArr.join('<br/>');
    }

    if (err.data) {
        return "Error. Status " + err.status + ' ' + err.data;
    }

    return "Error. Status " + err.status;
}
