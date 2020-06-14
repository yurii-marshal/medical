import SignaturePad from '../../../../bower_components/signature_pad/src/signature_pad';

export default function signature() {
    /* @ngInject */
    return {
        restrict: 'A',
        scope: {
            setSignature: '=',
            signedBytes: '=',
            parentThis: '=?',
            sendBase64: '='
        },
        templateUrl: 'core/views/templates/signature.html',
        link: function(scope, elem) {
            let internalSetSignature;

            if (scope.parentThis) {
                internalSetSignature = scope.setSignature.bind(scope.parentThis);
            } else {
                internalSetSignature = scope.setSignature;
            }

            let wrapper = elem[0],
                clearButton = wrapper.querySelector('[data-action=clear]'),
                saveButton = wrapper.querySelector('[data-action=apply]'),
                resetButton = wrapper.querySelector('[data-action=reset]'),
                canvas = wrapper.querySelector('canvas'),
                signaturePad;

            function resizeCanvas() {
                // When zoomed out to less than 100%, for some very strange reason,
                // some browsers report devicePixelRatio as less than 1
                // and only part of the canvas is cleared then.
                let ratio = Math.max(1, 1);

                canvas.width = elem.find('.signature-pad-body').width() * ratio;
                canvas.height = elem.find('.signature-pad-body').height() * ratio;
                canvas.getContext('2d').scale(ratio, ratio);
            }

            window.onresize = resizeCanvas;
            resizeCanvas();

            $(resetButton).hide();

            signaturePad = new SignaturePad(canvas, {
                minWidth: 4,
                maxWidth: 6
            });

            if (scope.signedBytes && scope.signedBytes.toData) {
                signaturePad.fromData(scope.signedBytes.toData());
            }

            let clear = function() {
                signaturePad.clear();
                scope.signedBytes = undefined;
                scope.setSignature(undefined);
            };

            let reset = function() {
                scope.setSigned = false;
                signaturePad.on();
                $(resetButton).hide();
                $(clearButton).show();
                $(saveButton).show();
            };

            let save = function() {
                if (signaturePad.isEmpty()) {
                    alert('Please provide signature first.');
                } else {
                    // window.open(signaturePad.toDataURL());

                    // var fileReader = new FileReader();
                    // var file = fileReader.readAsDataURL(signaturePad.toDataURL());

                    if (internalSetSignature !== undefined) {
                        let base64 = window.atob(signaturePad.toDataURL().split(',')[1]);
                        let length = base64.length;
                        let bytes = [];

                        for (let i = 0; i < length; i++) {
                            bytes.push(base64.charCodeAt(i));
                        }
                        if (scope.sendBase64) {
                            internalSetSignature(signaturePad);
                        } else {
                            internalSetSignature(bytes);
                        }

                        scope.setSigned = true;
                        signaturePad.off();
                        $(saveButton).hide();
                        $(clearButton).hide();
                        $(resetButton).show();
                    }
                }
            };

            clearButton.addEventListener('click', clear);
            resetButton.addEventListener('click', reset);
            saveButton.addEventListener('click', save);

            scope.$on('$destroy', () => {
                clearButton.removeEventListener('click', clear);
                resetButton.removeEventListener('click', reset);
                saveButton.removeEventListener('click', save);
            });

            // API
            /* var canvas = document.querySelector("canvas");

            var signaturePad = new SignaturePad(canvas);

            // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
            signaturePad.toDataURL(); // save image as PNG
            signaturePad.toDataURL("image/jpeg"); // save image as JPEG

            // Draws signature image from data URL
            signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

            // Clears the canvas
            signaturePad.clear();

            // Returns true if canvas is empty, otherwise returns false
            signaturePad.isEmpty();

            // Unbinds all event handlers
            signaturePad.off();

            // Rebinds all event handlers
            signaturePad.on();*/
        }
    };
}
