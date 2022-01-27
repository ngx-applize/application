import { BehaviorSubject, Observable, Subject, filter, map } from 'rxjs';
import { Injectable, Type } from '@angular/core';

/**
 * A Typed event let's you to determine type of event's data.
 */
export class TypedEvent<T = any> {
  /**
   * Create a new `TypedEvent` which connects a key to a type.
   * @param key The key of typed event. This is the key which an event is identified by.
   */
  constructor(public key: string) { }
}

/**
 * The channel to publish or subscribe events.
 */
export type TEventPublishChannel = 'live' | 'historical';

/**
 * Event publishing options.
 */
export interface IEventPublishOptions {
  /**
   * The channel in which the event will be published. [Read more](https://github.com/ngx-applize/README.md#EventChannels) about channels.
   *
   * There is only two available values:
   * - `live`: means subscribers to this event will be able to catch the event **after** publishing this event.
   * - `historical`: means subscribers to this event will be able to catch the event **after** publishing this event **and the last event before subscribing**.
   *
   * @default 'live'
   *
   */
  channel?: TEventPublishChannel;

  /**
   * Determines whether to broadcast events to other browser tabs or not.
   *
   * @default true
   */
  broadcast?: boolean;
}

export const DEFAULT_PUBLISH_OPTIONS: Required<IEventPublishOptions> = {
  channel: 'live',
  broadcast: true,
};

interface IEventInstance<T = any> {
  key: string;
  data?: T;
}

interface IChannelMessage<T = any> extends IEventInstance {
  channel: TEventPublishChannel,
}

/**
 * The service to publish events and to listen events.
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {

  #channels: Record<TEventPublishChannel, Subject<IEventInstance | null>> = {
    live: new Subject<IEventInstance | null>(),
    historical: new BehaviorSubject<IEventInstance | null>(null),
  };

  #broadcastChannel: BroadcastChannel = new BroadcastChannel(window.location.host);

  constructor() {
    this.#broadcastChannel.onmessage = (message: MessageEvent<IChannelMessage>) => {
      this.#channels[message.data.channel].next(message.data);
    };
  }


  /**
   * Publishs an event so the subscribers can catch it.
   * @param event The typed event to publish.
   * @param options Event publishing options.
   *
   * @example
   * ```typescript
   * // define an event:
   * const EVENT_COUNTER_CLICK = new TypedEvent<number>('counter.click');
   *
   * _@ngComponent({})
   * export class MyComponent {
   *   clicks = 0;
   *
   *   constructor (private eventService: EventService) {}
   *
   *   onCounterIncClick() {
   *     // publish event
   *     this.eventService.publish(EVENT_COUNTER_CLICK, ++this.clicks);
   *   }
   * }
   * ```
   */
  publish<T = any>(event: TypedEvent<T>): void;
  publish<T = any>(event: TypedEvent<T>, options: IEventPublishOptions): void;
  publish<T = any>(event: TypedEvent<T>, data: T): void;
  publish<T = any>(event: TypedEvent<T>, data: T, options: IEventPublishOptions): void;
  publish<T = any>(event: TypedEvent<T>, _data?: T | IEventPublishOptions, _options?: IEventPublishOptions) {
    const isDataPassed = Object.keys(_data ?? {}).some(k => !Object.keys(DEFAULT_PUBLISH_OPTIONS).includes(k));
    const options = {
      ...DEFAULT_PUBLISH_OPTIONS,
      ...(isDataPassed ? _options : {})
    };
    const eventData = isDataPassed ? _data : null;

    this.#channels[options.channel].next({ key: event.key, data: isDataPassed ? _data : null });

    if (options.broadcast) {
      this.#broadcastChannel.postMessage({ key: event.key, data: isDataPassed ? _data : null })
    }
  }

  /**
   * Catchs and event and returns the data value.
   * @param event The typed event to listen.
   * @param channel (Optional) The channel to subscribe. [Read more]() about channels.
   * @returns `Observable<T>` which `T` is the type of data transmitted with event.
   * @example
   * ```ts
   * eventService.listen(EVENT).subscribe(data => {
   *    // do wathever you want to do with data
   * });
   * ```
   */
  listen<T>(event: TypedEvent<T>, channel: TEventPublishChannel = 'live'): Observable<T> {
    return this.#channels[channel]
      .pipe(
        filter(x => x?.key === event.key),
        map(x => x?.data),
      );
  }

  /**
   * Binds a property of an object to data of specific event.
   * @param target The target object.
   * @param property The property of target object to be bound.
   * @param event The event to listen.
   * @param channel The channel to subscribe.
   * @example
   * ```ts
   * // suppouse this code:
   * eventService.listen(EVENT).subscribe(data => someVariable = data);
   *
   * // you can simply bind that variable to the event's data:
   * eventService.bind(this,someVariable, EVENT);
   * ```
   */
  bind<T>(target: T, property: keyof T, event: TypedEvent<T[keyof T]>, channel: TEventPublishChannel = 'live') {
    this.listen(event, channel).subscribe(x => target[property] = x);
  }
}
