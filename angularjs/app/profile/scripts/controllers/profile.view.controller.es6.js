export default class profileViewController {
    constructor(profile) {
        'ngInject';

        this.profile = profile;
        this.permissions = {
            'edit': true
        };
    }
}
