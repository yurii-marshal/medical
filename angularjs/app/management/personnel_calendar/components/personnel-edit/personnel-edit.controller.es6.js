export default class personnelEditController {
    constructor(
        $rootScope,
        $state,
        ngToast,
        bsLoadingOverlayService,
        personnelListService,
        corePersonnelService,
        profileService
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.personnelListService = personnelListService;
        this.corePersonnelService = corePersonnelService;
        this.profileService = profileService;
        this.personnelId = $state.params.personnelId;
        this.personnel = {
            ScheduleAble: false,
            Roles: [],
            Tags: []
        };
        this.searchTextRoles = '';
        this.roles = [];
        this.tags = [];

        this.activate();
    }

    activate() {
        this.personnelListService.getAllRoles()
            .then((response) => this.roles = response.data);

        if (this.personnelId) {
            this.corePersonnelService.getPersonnel(this.personnelId)
            .then((response) => {
                this.personnel = {
                    Name: response.data.Name,
                    ScheduleAble: response.data.ScheduleAble,
                    Credentials: response.data.Credentials,
                    Certifications: response.data.Certifications,
                    Email: response.data.User.Email,
                    Login: response.data.User.Login,
                    Tags: response.data.Tags.map((tag) => tag.Name)
                };
                this.role = response.data.User.Roles[0];
            });
        }

        this.corePersonnelService.getAllTags()
            .then((response) => this.tags = response.data.Items.map((item) => item.Name));
    }

    getTags(query) {
        let res = this.tags;

        // filter by query
        if (query) {
            res = res.filter((item) => item.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        // exclude by selected Roles
        if (this.personnel.Tags && this.personnel.Tags.length > 0) {
            res = res.filter((item) => this.personnel.Tags.indexOf(item) === -1);
        }

        return res;
    }

    addTag(newTag) {
        if (!newTag) {
            return;
        }
        if (!this.personnel.Tags.find((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
            this.personnel.Tags.push(newTag);
        }
        this.searchTextTags = '';
        document.getElementById('personnel-autocomplete-tags-input').blur();
    }

    deleteTagsByIndex(index) {
        this.personnel.Tags.splice(index, 1);
    }

    goToPersonnelList() {
        this.$state.go('root.management.personnel');
    }

    cancel() {
        this.goToPersonnelList();
    }

    save() {
        if (this.personnelEditForm.$invalid) {
            touchedErrorFields(this.personnelEditForm);
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'personnelEdit' });
        this.personnel.Roles = [this.role.Id];

        const saveFn = this.personnelId ?
            this.corePersonnelService.update(this.personnelId, this.personnel) :
            this.corePersonnelService.create(this.personnel);

        saveFn
            .then(() => {
                this.ngToast.success(`Team Member is ${!this.personnelId ? 'created' : 'updated'}`);
                if (this.personnelId) {
                    let profile = this.profileService.getProfile();

                    if (+profile.PersonnelId === +this.personnelId) {
                        this.$rootScope.$broadcast('updateProfile');
                    }
                }
                this.goToPersonnelList();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'personnelEdit' }));
    }
}
