import { IPointGroup } from 'signature_pad';
import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class CanvasResizeService {

    constructor() {
    }

    public resize(canvas: ElementRef, canvasContainer: ElementRef, padData: IPointGroup[]) {
        /** When zoomed out to less than 100% some browsers report devicePixelRatio
         *  as less than 1 and only part of the canvas is cleared then.
         *  So we will have at least 1 as ration.
         */
        const ratio = 1;
        const canvasNativeElement = canvas.nativeElement;
        const canvasContainerNativeElement = canvasContainer.nativeElement;

        // information needed to calculate the available width and height
        const canvasStyles = window.getComputedStyle(canvasNativeElement, null);
        const canvasBorder: any = {};

        canvasBorder.top = parseInt(canvasStyles.borderTopWidth, null) || 0;
        canvasBorder.bottom = parseInt(canvasStyles.borderBottomWidth, null) || 0;
        canvasBorder.left = parseInt(canvasStyles.borderLeftWidth, null) || 0;
        canvasBorder.right = parseInt(canvasStyles.borderRightWidth, null) || 0;
        canvasBorder.fullHeight = canvasBorder.top + canvasBorder.bottom;
        canvasBorder.fullWidth = canvasBorder.left + canvasBorder.right;

        const containerStyles = window.getComputedStyle(canvasContainerNativeElement, null);
        const parentPadding: any = {};

        parentPadding.top = parseInt(containerStyles.paddingTop, null) || 0;
        parentPadding.bottom = parseInt(containerStyles.paddingBottom, null) || 0;
        parentPadding.left = parseInt(containerStyles.paddingLeft, null) || 0;
        parentPadding.right = parseInt(containerStyles.paddingRight, null) || 0;
        parentPadding.fullHeight = parentPadding.top + parentPadding.bottom;
        parentPadding.fullWidth = parentPadding.left + parentPadding.right;

        const withToSubtract = parentPadding.fullWidth + canvasBorder.fullWidth;
        const heightToSubtract = parentPadding.fullHeight + canvasBorder.fullHeight;

        // resize canvas

        let signatureWidth = 0; // get most right point of signature
        let signatureHeight = 0; // get most left point of signature
        const signaturePadData = padData;

        if (signaturePadData && [].constructor === signaturePadData.constructor) {
            signatureWidth = signaturePadData
                .reduce((concated, arr) => concated.concat(arr), [])
                .reduce((mR, segment) => mR < segment.x ? segment.x : mR, 0);
            signatureHeight = signaturePadData
                .reduce((concated, arr) => concated.concat(arr), [])
                .reduce((mL, segment) => mL < segment.y ? segment.y : mL, 0);
        }

        // calc new width and height
        const newCanvasWidth = Math.max(canvasContainerNativeElement.clientWidth, signatureWidth);
        const newCanvasHeight = Math.max(canvasContainerNativeElement.clientHeight, signatureHeight);

        // adopt canvas scales
        canvasNativeElement.width = (newCanvasWidth - withToSubtract) * ratio;
        canvasNativeElement.height = (newCanvasHeight - heightToSubtract - 6) * ratio; // @TODO find the 6px
        canvasNativeElement.getContext('2d').scale(ratio, ratio);
        // adopt show/hide scroll of vertical canvas container
        canvasContainerNativeElement.style.overflowX = 'inherit';
        if (canvasContainerNativeElement.width + withToSubtract > canvasContainerNativeElement.clientWidth) {
            canvasContainerNativeElement.style.overflowX = 'scroll';
        }
        // adopt show/hide scroll of horizontal canvas container
        canvasContainerNativeElement.style.overflowY = 'inherit';
        if (canvasContainerNativeElement.height > canvasContainerNativeElement.clientHeight) {
            canvasContainerNativeElement.style.overflowY = 'scroll';
        }
    }

}
