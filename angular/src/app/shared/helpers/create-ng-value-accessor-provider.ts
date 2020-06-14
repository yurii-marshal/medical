import { InjectionToken } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { forwardRef } from '@angular/core';

export interface ValueAccessorProvider {
    provide: InjectionToken<ControlValueAccessor>;
    useExisting: any;
    multi: boolean;
}

export function createValueAccessorProvider(componentClass: any): ValueAccessorProvider {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => componentClass),
        multi: true,
    };
}
