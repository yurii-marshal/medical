import template from '../../views/modals/fill.sign.form.modal.html';
import fillSignFormModalController from '../controllers/modals/fill.sign.form.modal.controller.es6';
export default function signatureImg($mdDialog) {
    'ngInject';
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            let savedSignData = null;

            element.on('click', (event) => {
                event.preventDefault();
                    $mdDialog.show({
                        template: template,
                        controller: fillSignFormModalController,
                        controllerAs: '$ctrl',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            signedData: savedSignData
                        }
                    }).then((res) => {
                        let $element = $(element[0]);

                        savedSignData = res;

                        $element.css({
                            background: `url(${res.toDataURL("image/png")})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center'
                        });

                        $element.attr("img-src", res.toDataURL("image/png"));
                    });

            });
        }
    };


}
