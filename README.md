# ngx-applize

The building blocks of your smart Angular application.

## Table of contents
- [ngx-applize](#ngx-applize)
  - [Table of contents](#table-of-contents)
  - [@ngx-applize/events](#ngx-applizeevents)
    - [Installation](#installation)
    - [Usage](#usage)
      - [1. Import **`EventsModule`** from `@ngx-applize/events`:](#1-import-eventsmodule-from-ngx-applizeevents)
      - [2. Define a `TypedEvent`](#2-define-a-typedevent)
      - [3. Publish Events](#3-publish-events)
        - [By service](#by-service)
        - [By directive](#by-directive)
## @ngx-applize/events

A ways to raise and handle events through multiple browser tabs inside an Angular 12+ Application.

### Installation

Install the package using `npm`:
```sh
npm i @ngx-applize/events --save
```

### Usage

#### 1. Import **`EventsModule`** from `@ngx-applize/events`:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EventsModule } from '@ngx-applize/events';

@NgModule({
    imports: [
        BrowserModule,
        EventsModule.forRoot(), // <--
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 2. Define a `TypedEvent`

Create a file next to `app.component.ts` called `events.ts` and copy following lines to it:

```ts
// The 'key' can be any string, but keep avoid duplicate keys!
// Untyped events have no generic parameter:
export const EVENT_COUNTER_INC = new TypedEvent('counter.inc');

// Typed events have expicitly mentioned the type of data
export const EVENT_COUNTER_UPDATE = new TypedEvent<number>('counter.update');
```

#### 3. Publish Events
##### By service
```ts
import { Component } from '@angular/core';
import { EventService } from '@ngx-applize/events';
import { EVENT_INC_COUNTER } from './events.ts';

@Component({
    selector: 'app',
    template: `
        <button (click)="onClick()"> Inc. Counter </button>
    `
})
export class AppComponent {

    #localCache: number = 0;

    constructor(eventService: EventService) {    }

    onClick() {
      // Publishing with no data
      this.eventService.publish(EVENT_INC_COUNTER);
      
      // Publishing with data
      this.eventService.publish(EVENT_COUNTER_UPDATE, this.#localCache);
      
      // This will give you a type mismatch error:
      this.eventService.publish(EVENT_COUNTER_UPDATE, 'Some String Value');
    }
}
```

##### By directive
```html
<button 
  publish="counter.update"
  on="click",
  [with]="10"
> Click on me to publish event </button>
```
