import { EventService } from './event.service';
import { TestBed } from '@angular/core/testing';
import { TypedEvent } from '.';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send an event', () => {
    try {
      const EVENT = new TypedEvent('testEvent');
      const publishSpy = jasmine.createSpy('publishSply', service.publish);
      publishSpy(EVENT, undefined, {});
      expect(service.publish).toHaveBeenCalled();
    } catch (error) {
      fail(error);
    }
  });
});
