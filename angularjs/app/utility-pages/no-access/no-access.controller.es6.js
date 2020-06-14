export default class NoAccessController {
    constructor($state, authService) {
        'ngInject';

        // if (!authService.getAccessToken()) {
        //     $state.go('login');
        // }
    }
}
