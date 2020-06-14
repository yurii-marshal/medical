import template from './file-upload.html';

class fileUploadCtrl {
    constructor($scope, ngToast, FileUploader) {
        'ngInject';

        this.$scope = $scope;
        this.ngToast = ngToast;

        this.uploaderDone = false;
        this.uploadOptions = {
            removeAfterUpload: true,
            queueLimit: this.maxCount || 1,
            method: 'POST'
        };
        this.uploader = new FileUploader();

        this.uploader.filters.push({
            name: 'sizeFilter',
            fn: (item) => item.size < this.maxSize * 1024 * 1024
        });
        this.uploader.filters.push({
            name: 'extensionFilter',
            fn: (item) => {
                const currentExtention = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();

                return this.extensions.indexOf(currentExtention) !== -1;
            }
        });

        this.uploader.onAfterAddingAll = this.onAfterAddingAll.bind(this);
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed.bind(this);
        this.uploader.onErrorItem = this.onErrorItem.bind(this);

        this.uploaderDone = true;
    }

    onAfterAddingAll(addedFileItems) {
        angular.forEach(addedFileItems, (val) => {
            const fileReader = new FileReader();

            if (this.maxCount && this.maxCount === 1) {
                this.uploader.clearQueue();
                this.files = [];
            }

            let $this = this;

            if (this.files.length) {
                let isInGridFiles = false;

                angular.forEach(this.files, (val2) => {
                    if (val2.Name === val._file.name) {
                        isInGridFiles = true;
                    }
                });

                if (!isInGridFiles) {
                    fileReader.onloadend = function () {
                        $this.files.push(
                            {
                                Name: val._file.name,
                                Bytes: $this.getByteArray(this.result)
                            }
                        );
                        $this.$scope.$apply();
                    };
                    fileReader.readAsArrayBuffer(val._file);
                } else {
                    this.uploader.removeFromQueue(val);
                }
            } else {
                fileReader.onloadend = function() {
                    $this.files.push(
                        {
                            Name: val._file.name,
                            Bytes: $this.getByteArray(this.result)
                        }
                    );
                    $this.$scope.$apply();
                };
                fileReader.readAsArrayBuffer(val._file);
            }
        });
    }

    onErrorItem(fileItem, response, status, headers) {
        ngToast.danger('Unexpected error happend while uploading files');
    }

    onWhenAddingFileFailed(item, filter, options) {
        if (filter !== undefined && filter !== null && filter.hasOwnProperty('name')) {
            if (filter.name === 'extensionFilter') {
                const formatedExtList = this.extensions.filter((v) => v !== '').join(', ');
                this.ngToast.danger(`Wrong file extension for ''${item.name}''. <br>Available formats - ${formatedExtList}<br/>`);
                return;
            }
            if (filter.name === 'sizeFilter') {
                this.ngToast.danger(`To big file size. Selected file ''${item.name}'' has size greater than ${this.maxSize} Mb<br/>`);
                return;
            }
        }
        this.ngToast.danger('Unexpected error happend while uploading files');
    };

    runFileUpload() {
        const fileUploader = document.getElementById('fileUploader');

        fileUploader.value = '';
        fileUploader.click();
    }

    getByteArray(bytes) {
        let byteArray = [];
        const uint8Array = new Uint8Array(bytes);

        angular.forEach(uint8Array, (value) => byteArray.push(value));
        return byteArray;
    }
}

const fileUpload = {
    bindings: {
        files: '=',
        maxCount: '=',
        maxSize: '=',
        extensions: '=',
        buttonText: '@',
        smallButton: '=?'
    },
    template,
    controller: fileUploadCtrl
};

export default fileUpload;
