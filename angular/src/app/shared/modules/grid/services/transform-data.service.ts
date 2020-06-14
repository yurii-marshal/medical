import { Injectable, Inject } from '@angular/core';

@Injectable()
export class TransformDataService {

    constructor(
        @Inject('moment') private moment,
    ) {
    }

    transform(data) {
        const transformedData = {};

        Object.keys(data).forEach((key) => {
            if (data[key] instanceof this.moment) {
                // Format Moment data
                data[key] = this.moment(data[key]).format('YYYY-MM-DD');
            }
            // Delete empty input or format to proper request type if not empty
            !data[key] ? delete data[key] : transformedData[`filter.${key}`] = data[key];
        });

        return transformedData;
    }
}
