import { Injectable } from '@angular/core';
import { GridStateData } from '../interfaces/grid-state-data';
import { GridStateDataVal } from '../interfaces/grid-state-data';

@Injectable()
export class GridStateService {
    public gridData: GridStateData = {};

    constructor() {
    }

    public getData(key): GridStateDataVal {
        return this.gridData[key];
    }

    public setData(key: string, value: GridStateDataVal): void {
        this.gridData[key] = {...this.gridData[key], ...value};
    }

    public removeData(key): void {
        delete this.gridData[key];
    }
}
