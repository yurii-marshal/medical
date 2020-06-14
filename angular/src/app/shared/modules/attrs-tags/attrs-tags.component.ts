import { MatIconRegistry } from '@angular/material';
import { TagsType } from './../../endpoints/core/tags/tags.enum';
import { Tag } from './../../endpoints/core/tags/tags.interface';
import { TagsEndpointsService } from './../../endpoints/core/tags/tags.endpoints';
import { DomSanitizer } from '@angular/platform-browser';
import {
    debounceTime,
    flatMap,
    filter,
    map,
    tap,
} from 'rxjs/operators';
import {
    Subscription,
    BehaviorSubject,
} from 'rxjs';
import { addTagClass } from './add-tag-class';
import { FormControl } from '@angular/forms';
import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    OnDestroy,
    Input,
    ViewChild,
    ElementRef,
} from '@angular/core';

/**
 * Use this component for manage tags.
 *
 * <example-url>http://niko.loc:8082/v2#/demo-components/attrs-tags</example-url>
 *
 * Location:
 * -------------------
 * **AttrsTagsModule**
 * @example
 *  <app-attrs-tags
 *                 (tagsUpdated)="showTags($event)"
 *                 [inputWidth]="500"
 *                 [disableTagCreate]="false">
 * </app-attrs-tags>
 */
@Component({
    selector: 'app-attrs-tags',
    templateUrl: './attrs-tags.component.html',
    styleUrls: ['./attrs-tags.component.scss'],
})

export class AttrsTagsComponent implements OnInit, OnDestroy {
    public tagsDisplayName = 'Order Tags';
    public tagInput = new FormControl('');
    public addTagClass = addTagClass;
    public isLoading = false;
    public valueChangesSubscription: Subscription;
    public tagsDictionary$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    /** Set input width. By default 200 */
    @Input() inputWidth = 200;
    /** Init tags data */
    @Input() tags: Tag[] = [];
    /** If you don't found any tag, add ability create new. By default false */
    @Input() disableTagCreate = false;
    /** Event emitted when tags are updating */
    @Output() tagsUpdated = new EventEmitter<Tag[]>();
    @ViewChild('tagInputField') tagInputField: ElementRef;
    private readonly debounceTime = 300;

    constructor(
        private tagService: TagsEndpointsService,
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
    }

    private _tagType = TagsType.order;

    /** You can select tag source Patient/Invoice/Order. Use TagsType enum. By default selected Order */
    @Input() set tagType(tagType: TagsType) {
        this._tagType = tagType;

        switch (tagType) {
            case TagsType.patient:
                this.tagsDisplayName = 'Patient Tags';
                break;
            case TagsType.claim:
                this.tagsDisplayName = 'Invoice Tags';
                break;
            case TagsType.order:
            default:
                this.tagsDisplayName = 'Order Tags';
        }
    }

    ngOnInit() {
        this.matIconRegistry.addSvgIcon(
            'deleteIcon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/clear.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'tagIcon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/tag.svg'),
        );

        this.valueChangesSubscription = this.tagInput.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                filter((value) => typeof value === 'string'),
                tap(() => this.isLoading = true),
                flatMap((searchText: string) => this.tagService.getTags(this._tagType, searchText)),
                map((results: any) => {
                    results = results.allIds.map((stateId) => results.byId[stateId]);
                    return results.filter((result) => {
                        return !this.tags.find((element) => element.Id === result.Id);
                    });
                }),
                tap((value) => {
                    this.isLoading = false;
                    if (value.length === 0) {
                        if (this.disableTagCreate === false) {
                            this.tagsDictionary$.next([{
                                Name: `Add new tag "${this.tagInput.value}"`,
                                justName: this.tagInput.value,
                            }]);
                        } else {
                            this.tagsDictionary$.next([{Name: ' Not found. Please type tag name'}]);
                        }
                        return;
                    }
                    this.tagsDictionary$.next(value);
                }),
            ).subscribe();
        this.tagInput.setValue('');
    }

    ngOnDestroy() {
        if (this.valueChangesSubscription) {
            this.valueChangesSubscription.unsubscribe();
        }
    }

    public onTagSelected(event: any): void {
        this.tagInput.setValue('');

        if (event.option.value.justName) {
            this.createTag(event.option.value.justName);
            return;
        }

        if (!event.option.value.Id) {
            return;
        }
        this.tags.push(event.option.value);
        this.tagsUpdated.emit(this.tags);
        this.tagInputField.nativeElement.blur();
    }

    public deleteTag(index: number): void {
        this.tags.splice(index, 1);
        this.tagsUpdated.emit(this.tags);
    }

    public cleanInput(): void {
        this.tagInput.setValue('');
    }

    public displayFn(state: Tag): string | null {
        return state && state.Name ? state.Name : null;
    }

    public createTag(name): void {
        this.tagService.createTag(this._tagType, name)
            .toPromise()
            .then((tag) => {
                this.tags.push({Id: tag.Id, Name: tag.Name});
                this.tagInputField.nativeElement.blur();
                this.tagsUpdated.emit(this.tags);
            });
    }

    public addClass(name: string): string {
        return this.addTagClass(name, this._tagType);
    }

}
