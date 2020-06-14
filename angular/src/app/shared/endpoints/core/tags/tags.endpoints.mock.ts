import { Injectable } from '@angular/core';
import { TagsState } from './tags.interface';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

@Injectable()
export class TagsEndpointsMockService {

    constructor() { }

    public getTags(): Observable<TagsState> {
        return of(
            {
                byId: {
                    0: { Id: '9', Name: 'Authorization Expired' },
                    1: { Id: '1', Name: '90' },
                    2: { Id: '2', Name: 'Wayne Said So' },
                    3: { Id: '3', Name: '67' },
                    4: { Id: '4', Name: '67' },
                    5: { Id: '5', Name: '67' },
                    6: { Id: '6', Name: '90' },
                    7: { Id: '7', Name: '57' },
                    8: { Id: '8', Name: 'self pay' },
                    9: { Id: '9', Name: '57' },
                    10: { Id: '0', Name: '90' },
                },
                allIds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            },
        );
    }
}
