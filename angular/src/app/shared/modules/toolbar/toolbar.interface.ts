export interface ToolbarIcon {
    url: string;
    w: number;
    h: number;
}

export interface ToolbarRow {
    text: string;
    icon: ToolbarIcon;
    isHidden: boolean;
    svgIcon: string;
    clickFunction();
}
