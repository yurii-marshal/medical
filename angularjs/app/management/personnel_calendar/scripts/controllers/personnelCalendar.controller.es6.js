export default class personnelCalendarController {
    constructor(
        $state,
        $timeout,
        profileService
    ) {
        'ngInject';

        this.$state = $state;
        this.$timeout = $timeout;
        this.profileService = profileService;

        this.ScheduleAble = false;
        this.permissions = { edit: false };

        this.selectedPersonnel = null;
        this.personnelId = $state.params.personnelId;

        if (this.personnelId && this.personnelId >= 0) {
            this.permissions = {
                edit: true
            };
            this.getPersonnelById(this.personnelId);
        }
    }

    getPersonnelByName(query) {
        return this.profileService.getPersonnelDictionaryPromise(query)
            .then((response) => response.data.Items);
    }

    getPersonnelById(personnelId) {
        return this.profileService.getPersonnelByIdPromise(personnelId)
            .then((response) => {
                this.selectedPersonnel = response.data;
                this.selectedPersonnel.Id = personnelId;
                this.selectedPersonnel.Name.FullName = `${response.data.Name.FirstName} ${response.data.Name.LastName}`;
                this.ScheduleAble = response.data.ScheduleAble;
            });
    }

    setPersonnel(item) {
        this.$timeout(() => {
            this.$state.go('.', { personnelId: this.selectedPersonnel ? item.Id : -1 });
        }, 100);
    }
}
