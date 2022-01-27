import { DEFAULT_PUBLISH_OPTIONS, EventService, IEventPublishOptions, TEventPublishChannel } from '../services';
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[publish]'
})
export class PublishEventDirective<T> {

  @Input('publish') event!: string;
  @Input('on') trigger: keyof HTMLElementEventMap = 'click';
  @Input('with') data: T | undefined;
  @Input('options') options: IEventPublishOptions | undefined = {};

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private eventService: EventService,
  ) {
    this.elementRef.nativeElement.addEventListener(this.trigger, () => {
      this.eventService.publish({ key: this.event }, this.data, { ...DEFAULT_PUBLISH_OPTIONS, ...this.options });
    });
  }


}
