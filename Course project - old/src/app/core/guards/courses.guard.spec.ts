import { TestBed, async, inject } from '@angular/core/testing';

import { CoursesGuard } from './courses.guard';

describe('CoursesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesGuard]
    });
  });

  it('should ...', inject([CoursesGuard], (guard: CoursesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
