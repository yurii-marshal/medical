"use strict";
//TODO: Refactore this to es6 syntax and optimization this code. It is moved from physician portal
function PdfEditor(container, $scope, $compile) {

    var _radioButtonsCounter = 1,
        _currentRadioButtonGroupName;

    if (!container) throw new Error("[Error] container cannot be undefined.");

    function dataReceived(data) {
        if (!data.Pages && !(data.Pages instanceof Array)) console.log("Invalid format of json.");

        data.Pages.forEach(renderPage);
    }

    function renderPage(pageDetails) {
        var $mainContainer = container[0];

        var index = pageDetails.Index;
        var height = pageDetails.Size.Height;
        var width = pageDetails.Size.Width;
        var scalePage = width > 1600 ? (1600/width).toFixed(2) : 1;
        var scaleSmallPage = width > 1600 ? (1500/width).toFixed(2) : 1;

        var scaleStyle = 'transform: scale(' + scalePage +');' +
            ' @media only screen and (max-width: 1650px) {transform: scale(' + scaleSmallPage +');}' ;

        var $divContainer = $('<div class="page" style="'+scaleStyle+'"></div>');
        $mainContainer.appendChild($divContainer[0]);

        var $canvas = $('<canvas id="canvas_' + index + '" width="' + width + '" height="' + height + '"></canvas>');
        $divContainer.append($canvas);
        renderImage($canvas[0], pageDetails.Image);

        pageDetails.Fields.forEach(function (value) {
            renderField(value, $divContainer);
        });
    }

    function renderField(fieldDetails, $container) {
        var field = null;
        var rect = fieldDetails.Rect;
        var $wrapper = $('<div class="wrapper"></div>').width(rect.Width + 5).height(rect.Height);
        $container.append($wrapper);

        switch (parseInt(fieldDetails.Type.Id)) {
            case 2:
                field = CreateTextField(fieldDetails);
                break;
            case 3:
                field = CreateCheckboxField(fieldDetails);
                break;
            case 4:
                field = CreateComboBoxField(fieldDetails);
                break;
            case 5:
                field = CreateRadioButtonField(fieldDetails);
                break;
            case 7:
                field = CreateImageSignature(fieldDetails);
                break;
        }

        if (field) {

            field.style.left = '0px';
            field.style.top = '0px';
            if (fieldDetails.Font.Size === 0) {
                fieldDetails.Font.Size = 10;
            }
            field.style.fontSize = fieldDetails.Font.Size + "px";
            field.style.zIndex = 150 + fieldDetails.Index;
            field.Id = fieldDetails.FullName;

            $wrapper[0].appendChild(field);
            addInputControlCover(fieldDetails.Type.Id, field, $wrapper);

        }

        $wrapper.css("position", "absolute");
        $wrapper.css("top", rect.Y -1);
        $wrapper.css("left", rect.X);
    }

    function addInputControlCover(id, field, $wrapper) {
        switch (parseInt(id)) {
            case 3:
                $wrapper.addClass('checkbox-wrapper').append('<div class="checkbox-cover"/>');
                break;
            case 5:
                $wrapper.addClass('radio-btn-wrapper').append('<div class="radio-btn-cover"/>');
                break;
            default:
                break;
        }
    }

    function CreateTextField(fieldDetails) {
        // debugger
        var textField = null;
        //if (fieldDetails.Multiline) {
        textField = document.createElement('textarea');
        /*} else {
         textField = document.createElement('input');
         textField.type = "text";
         textField.name = textField.PartialName;
         }*/
        if (fieldDetails.Text){
            textField.value = fieldDetails.Text;
        }
        textField.classList.add("pdf-text-field");
        textField.style.height = fieldDetails.Rect.Height + 5 + "px";
        textField.style.width = fieldDetails.Rect.Width + 5 + "px";
        textField.style.paddingTop = ((fieldDetails.Rect.Height - fieldDetails.Font.Size) / 2) + 'px';

        textField.style.fontFamily = fieldDetails.Font.Name;
        textField.style.color = (fieldDetails.Font.Color).toLowerCase();
        textField.style.fontSize = fieldDetails.Font.Size + "px";
        textField.style.lineHeight = fieldDetails.Font.Size + "px";
        textField.name = fieldDetails.FullName;
        textField.id = "id_" + fieldDetails.Index;


        return textField;
    }

    function CreateCheckboxField(fieldDetails) {
        var checkbox = document.createElement('input');

        checkbox.type = "checkbox";
        checkbox.checked = fieldDetails.Checked == 'true';

        checkbox.classList.add("pdf-checkbox");
        checkbox.name = fieldDetails.FullName;
        checkbox.id = "id_" + fieldDetails.Index;

        return checkbox;
    }

    function CreateComboBoxField(fieldDetails) {
        var combo = document.createElement("select");
        //todo: can add options fieldDetails.Options
        return combo;
    }

    function CreateRadioButtonField(fieldDetails) {
        var radio = document.createElement('input');

        if (_currentRadioButtonGroupName !== fieldDetails.ParentName) {
            _radioButtonsCounter = 1;
            _currentRadioButtonGroupName = fieldDetails.ParentName;
        }

        radio.type = "radio";
        radio.name = fieldDetails.ParentName;
        radio.value = _radioButtonsCounter;
        radio.checked = fieldDetails.Checked;
        radio.id = "id_" + fieldDetails.Index;
        radio.classList.add("pdf-radio");

        if (fieldDetails.BoxStyle && fieldDetails.BoxStyle.Name) {
            radio.classList.add('box-style-' + fieldDetails.BoxStyle.Name.toLowerCase());
        }

        _radioButtonsCounter++;

        return radio;
    }

    function CreateImageSignature(fieldDetails) {
        var imageBlock = document.createElement('div');
        imageBlock.id = "id_" + fieldDetails.Index;
        imageBlock.style.width = "100%";
        imageBlock.style.height = "100%";
        imageBlock.style.display = "block";
        imageBlock.style.cursor = "pointer";
        imageBlock.style.border = "1px solid black";
        imageBlock.backgroundImage = "";
        imageBlock.backgroundSize = "cover";
        imageBlock.setAttribute("signature-img","");
        imageBlock.setAttribute("image-src","");
        $compile(imageBlock)($scope);
        return imageBlock;

    }

    function renderImage(canvas, imgBytes) {
        var context = canvas.getContext('2d');
        var imageObj = new Image();
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = 'data:image/jpeg;base64,' + imgBytes;
    }

    return {
        container: container,
        loadPdf: function loadPdf(pages) {
            if (!pages) {
                throw new Error('[Error] pages cannot be undefined.');
            }

            pages.forEach(renderPage);
        }
    };
}
