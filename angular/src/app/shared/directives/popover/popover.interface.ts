import {
    PopoverArrowType,
    PopoverPlacement,
} from './popover.enum';

export interface PopoverOptions {
    content?: [string];
    arrow?: boolean;
    title?: [string];
    arrowType?: PopoverArrowType;
    placement?: PopoverPlacement;
    class?: string;
    itemsArray?: string[];
    distance?: number;
    html?: HTMLElement;
    duration?: number;
    allowTitleHTML?: boolean;
    theme?: string;
    appendTo?: HTMLElement;
    wait?: any;
    createPopperInstanceOnInit?: boolean;
}
