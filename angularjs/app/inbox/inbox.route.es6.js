export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state("root.inbox", {
            url: "/inbox",
            templateUrl: "inbox/views/inbox.html",
            controller: "inboxController as inbox",
            params: {
                topMenu: "Inbox",
                pageTitle: "Inbox"
            }
        })
        .state("root.inbox.list", {
            url: "/list",
            templateUrl: "inbox/views/inbox-list.html",
            controller: "inboxListController as list",
            params: {
                topMenu: "Inbox",
                pageTitle: "Inbox"
            }
        })
        .state("root.new_inbox_patient", {
            url: "/inbox/new-inbox-patient/",
            templateUrl: "inbox/views/attach-inbox-patient.html",
            controller: "inboxAttachPatientController as attach",
            params: {
                topMenu: "Inbox",
                pageTitle: "New patient(s)",
                docsArr: null
            }
        })
        .state("root.attach_inbox_patient", {
            url: "/inbox/attach-inbox-patient/",
            templateUrl: "inbox/views/attach-inbox-patient.html",
            controller: "inboxAttachPatientController as attach",
            params: {
                topMenu: "Inbox",
                pageTitle: "Attach patient(s)",
                docsArr: null
            }
        });
}


