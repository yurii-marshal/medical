import template from './notes.html';

class NotesCtrl {
    constructor($filter,
                $scope,
                $http,
                ngToast,
                $timeout,
                bsLoadingOverlayService) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$timeout = $timeout;
        this.ngToast = ngToast;

        this.notesUsers = undefined;
        this.isLoading = false;

        this.notesCount = 0;
        this.notesLoaded = false;

        this.topIndex = 0;
        this.newNoteSubject = undefined;
        this.newNoteText = undefined;
        this.newNoteMaxLength = this.newNoteMaxLength || 1024 * 1024;

        this.searchText = undefined;
        this.searchUser = undefined;
        this.searchSubject = undefined;
        this.fromDate = '';
        this.toDate = '';

        const $ctrl = this;

        this.notesList = {
            pageIndex: 0,
            pageSize: 12,
            filterExpression: function() {
                let _filter = {};

                _filter[$ctrl.noteTextFilter] = $ctrl.searchText || '';
                _filter[$ctrl.subjectFilter] = $ctrl.searchSubject || '';

                if ($ctrl.isUsersAutocomplete) {
                    _filter[$ctrl.createdByFilter] = ($ctrl.searchUser && $ctrl.searchUser.Id) ?
                        $ctrl.searchUser.Id :
                        '';
                } else {
                    _filter[$ctrl.createdByFilter] = $ctrl.searchUser || '';
                }

                _filter[$ctrl.startDateFilter] = $ctrl.fromDate ?
                    moment.utc($ctrl.fromDate, 'MM/DD/YYYY').format('YYYY-MM-DDT00:00:00') :
                    '';
                _filter[$ctrl.endDateFilter] = $ctrl.toDate ?
                    moment.utc($ctrl.toDate, 'MM/DD/YYYY').format('YYYY-MM-DDT23:59:59') :
                    '';

                return _filter;
            },
            sortExpression: $ctrl.defaultSort,
            numLoaded: 0,
            toLoad: 0,
            maxLength: 0,
            items: [],
            getItemAtIndex: function(index) {
                if (index > this.numLoaded) {
                    this.fetchMoreItems(index);
                    return null;
                }
                return this.items[index];
            },
            getLength: function() {
                if (this.maxLength && (this.numLoaded + 5 > this.maxLength)) {
                    return this.maxLength;
                }
                return this.numLoaded + 5;
            },
            fetchMoreItems: function(index) {
                if (this.toLoad <= index) {
                    bsLoadingOverlayService.start({ referenceId: 'notesList' });

                    this.pageIndex = this.toLoad / this.pageSize;
                    this.toLoad += this.pageSize;

                    $ctrl.getNotes(this.pageIndex, this.pageSize, this.sortExpression, this.filterExpression())
                        .then((obj) => {
                            this.maxLength = obj.data.Count;
                            $ctrl.notesCount = obj.data.Count;
                            $ctrl.notesLoaded = true;

                            if (obj.data.Items.length) {
                                this.items = this.items.concat(obj.data.Items);
                                angular.forEach(this.items, (note, key) => {
                                    note.index = key + 1;
                                    note.CreatedDateFormatted = $filter('localDateTime')(moment(note.CreatedDate).utc(), 'D MMM YYYY[,] h:mm A');
                                });
                                this.numLoaded = this.items.length;
                            }

                            if (obj.data.Count === 0) {
                                this.items = [];
                            }
                        })
                        .then(() => bsLoadingOverlayService.stop({ referenceId: 'notesList' }));
                }
            },
            addNewNote: function() {
                bsLoadingOverlayService.start({ referenceId: 'notesList' });
                $ctrl.clearFilters();
            }
        };

        this._activate();
    }

    _activate() {
        if (!this.isUsersAutocomplete) {
            this._getNotesUsers();
        }

        this._getNotesCount();
    }

    _getNotesUsers() {
        this.getUsers()
            .then((response) => {
                this.notesUsers = response.data.Items.map((item) => ({
                    Id: item.Id,
                    FullName: item.FullName || item.Name.FullName
                }));
            });
    }

    _getNotesCount() {
        this.getNotes(0, 1, '', '')
            .then((response) => {
                this.notesCount = response.data.Count;
                this.isUsersFieldDisabled = !response.data.Count;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'notesList' }));
    }

    _resetNotesOptions() {
        this.notesList.pageIndex = 0;
        this.notesList.pageSize = 12;
        this.notesList.numLoaded = 0;
        this.notesList.toLoad = 0;
        this.notesList.maxLength = 0;
        this.notesList.items = [];
        this.notesList.filterExpression();
        this._getNotesCount();
    }

    createNote() {

        if (this.createForm.$valid) {
            this.isLoading = true;
            this.bsLoadingOverlayService.start({ referenceId: 'notesList' });

            let data = {
                'Description': this.newNoteText,
                'Subject': this.newNoteSubject
            };

            this.addNote(data)
                .then(() => {
                    this.ngToast.success('Note was created');
                    this.notesList.addNewNote();
                    this.newNoteSubject = undefined;
                    this.newNoteText = undefined;
                    if (!this.isUsersAutocomplete) {
                        this._getNotesUsers();
                    }
                    this.createForm.$setUntouched();
                    this.createForm.$setPristine();
                })
                .finally(() => {
                    this.isLoading = false;
                    this.bsLoadingOverlayService.stop({ referenceId: 'notesList' });
                });
        } else {
            touchedErrorFields(this.createForm);
        }
    }

    searchByFilter() {
        this.$timeout(() => {
            /* $timeout for start/end time validation directive.
             When directive apply changes, then we check our form validation
            */
            if (this.filtersForm.$valid) {
                this._resetNotesOptions();
            }
        });
    }

    clearFilters() {
        this.searchText = undefined;
        this.searchUser = undefined;
        this.searchSubject = undefined;
        this.fromDate = '';
        this.toDate = '';
        this._resetNotesOptions();
    }

    searchByText($event) {
        if (($event.type === 'keydown' && $event.keyCode === 13) || $event.type === 'click') {
            this._resetNotesOptions();
        }
    }

    clearSearchByText() {
        if (!this.searchText) {
            this._resetNotesOptions();
        }
    }

    getAutocompleteUsers(name) {
        return this.getUsers(name);
    }

}

const notesComponent = {
    bindings: {
        defaultSort: '@',
        hasSubject: '=',
        notesSubjects: '=',
        getNotes: '=',
        addNote: '=',
        getUsers: '=',
        isDisableCreate: '=',
        noteTextFilter: '@',
        subjectFilter: '@?',
        createdByFilter: '@',
        startDateFilter: '@',
        endDateFilter: '@',
        newNoteMaxLength: '@',
        isUsersAutocomplete: '@?',
        isVoidInvoice: '<?'
    },
    template,
    controller: NotesCtrl
};

export default notesComponent;

