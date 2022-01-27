import { DIRECTIVES } from './list-of-directives';
import { NgModule } from '@angular/core';
import { SERVICES } from './list-of-services';

@NgModule({
  declarations: [
    ...DIRECTIVES,
  ],
  exports: [
    ...DIRECTIVES,
  ],
  providers: [
    ...SERVICES,
  ]
})
export class EventsModule { }
