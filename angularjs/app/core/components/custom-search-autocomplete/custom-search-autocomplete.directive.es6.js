export default function customSearchAutocomplete (customSearchAutocompleteService, $document) {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            customSearchAutocomplete: '=',
            /**
             * @param object look like this:
             * { patient: true, user: false, action: false }
             * All values are false by default
             */
            customAutocompleteOptions: '='
        },
        link: (scope, elem, attr) => {

            let targetElement = $(elem).closest('.custom-searchbar').eq(0);

            $(elem).on('keyup', ($event) => {
                if ($event.keyCode !== 13) {
                    let searchText = $(elem).val();
                    if (searchText.length) {
                        let isKeyCharTyped =
                            customSearchAutocompleteService.lookForSpecialChar(
                                searchText,
                                scope.customAutocompleteOptions,
                                $(elem)
                            );
                        if (isKeyCharTyped.type === 'patient') {
                            getPatients(isKeyCharTyped.input);
                        } else if (isKeyCharTyped.type === 'user') {
                            getUsers(isKeyCharTyped.input);
                        } else if (isKeyCharTyped.type === 'action') {
                            getActions(isKeyCharTyped.input);
                        } else {
                            removeAutocomplete();
                        }
                    } else {
                        removeAutocomplete();
                    }
                } else {
                    removeAutocomplete();
                }
            });

            $document.click(clickOutsideToClose);

            scope.$on('$destroy', () => {
                $(elem).off('keyup');
            });

            function clickOutsideToClose(event) {
                const autocompleteContainer = targetElement.eq(0).find('.custom-search-autocomplete-container');
                let isContainEl = autocompleteContainer.has(event.target).length > 0;

                if (!isContainEl) {
                    removeAutocomplete();
                }
            }

            function getPatients(term) {
                customSearchAutocompleteService.getPatients(term)
                    .then((response) => {
                        if (response.data && response.data.Items) {
                            generateAutocompleteTmpl('patient', response.data.Items, response.data.Count, term);
                        }
                    });
            }

            function getUsers(term) {
                customSearchAutocompleteService.getUsers(term)
                    .then((response) => {
                        if (response.data && response.data.Items) {
                            generateAutocompleteTmpl('user', response.data.Items, response.data.Count, term);
                        }
                    });
            }

            function getActions(term) {
                let actionsList = customSearchAutocompleteService.getActions(term);
                generateAutocompleteTmpl('action', actionsList);
            }

            function loadItems(element) {
                if (element.getAttribute('data-scroll-disabled') === 'true' ||
                    element.getAttribute('data-loading') === 'true') {
                    return;
                }
                element.setAttribute('data-loading', true);

                const pageIndex = +element.getAttribute('data-page-index');
                const term = element.getAttribute('data-term');
                const type = element.getAttribute('data-type');
                let promise;

                switch (type) {
                    case 'patient':
                        promise = customSearchAutocompleteService.getPatients(term, pageIndex);
                        break;
                    case 'user':
                        promise = customSearchAutocompleteService.getUsers(term, pageIndex);
                        break;
                    default:
                        break;
                }

                if (promise) {
                    promise
                        .then((response) => {
                            if (response.data && response.data.Items) {
                                const itemsTmpl = getItemsTmpl(type, response.data.Items);

                                element.insertAdjacentHTML('beforeend', itemsTmpl);
                                element.setAttribute('data-scroll-disabled', response.data.Count <= element.children.length);
                                element.setAttribute('data-page-index', pageIndex + 1);
                                element.setAttribute('data-loading', false);
                            }
                        });
                }
            }

            function generateAutocompleteTmpl(type, items, count, term) {
                const tmpl = `<div class="custom-search-autocomplete-container">${getItemsTmpl(type, items)}</div>`;

                if (targetElement.eq(0).find('.custom-search-autocomplete-container').length) {
                    targetElement.eq(0).find('.custom-search-autocomplete-container').eq(0).replaceWith(tmpl);
                } else {
                    targetElement.append(tmpl);
                }
                const element = targetElement[0].getElementsByClassName('custom-search-autocomplete-container')[0];

                element.setAttribute('data-type', type);
                element.setAttribute('data-term', term);
                element.setAttribute('data-page-index', 1);
                element.setAttribute('data-scroll-disabled', !count || count <= items.length);
                // subscribe to user click on item
                // for dynamically updating list of users
                selectUser();
            }

            function getItemsTmpl(type, items) {
                if (!items) {
                    return '';
                }
                let templates = [];

                items.forEach((item) => {
                    let itemTmpl = '';

                    if (type === 'patient' || type === 'user') {
                        itemTmpl = `<div class='item'
                                         data-${type}='{ 
                                             "id": "${item.Id}",
                                             "fullname": "${item.Name.FullName}" 
                                          }'>
                                        <span>${item.Name.FullName}</span>
                                     </div>`;
                    } else if (type === 'action') {
                        itemTmpl = `<div class='item' 
                                         data-${type}='{ 
                                            "name": "${item.name}"
                                         }'>
                                        <span class="font-bold">/${item.name}</span>
                                        <span>${item.params}</span><br>
                                        <span>${item.description}</span>
                                     </div>`;
                    }

                    templates.push(itemTmpl);
                });

                return templates.join('');
            }

            function selectUser() {
                let searchAutocomplete = targetElement[0].getElementsByClassName('custom-search-autocomplete-container')[0];

                if (!searchAutocomplete) {
                    return;
                }
                const scrollListener = (e) => {
                    e.stopPropagation();
                    if (e.target.getAttribute('data-scroll-disabled') === 'true') {
                        searchAutocomplete.removeEventListener('scroll', scrollListener);
                    }
                    loadItems(e.target);
                };

                searchAutocomplete.addEventListener('scroll', scrollListener);

                searchAutocomplete
                    .addEventListener('click', function (e) {
                        e.stopPropagation();
                        let item = e.target.className === 'item' ? e.target : e.target.parentElement;

                     if (item.matches('[data-patient]')) {
                         scope.customSearchAutocomplete =
                             userChoiceHandler(
                                 $(item).data('patient'),
                                 'patient',
                                 scope.customSearchAutocomplete,
                                 $(elem)
                             )
                     } else if (item.matches('[data-user]')) {
                         scope.customSearchAutocomplete =
                             userChoiceHandler(
                                 $(item).data('user'),
                                 'user',
                                 scope.customSearchAutocomplete,
                                 $(elem)
                             )
                     } else if (item.matches('[data-action]')) {
                         scope.customSearchAutocomplete =
                             userChoiceHandler(
                                 $(item).data('action'),
                                 'action',
                                 scope.customSearchAutocomplete,
                                 $(elem)
                             )
                     }

                     $(elem).focus().val(scope.customSearchAutocomplete);
                     searchAutocomplete.remove();
                });
            }

            function userChoiceHandler(user, type, searchStr, targetElement) {
                return customSearchAutocompleteService.userChoiceHandler(user, type, searchStr, targetElement)
            }

            function removeAutocomplete() {
                if (targetElement.eq(0).find('.custom-search-autocomplete-container')) {
                    targetElement.eq(0).find('.custom-search-autocomplete-container').remove();
                }
            }
        }
    }
}
