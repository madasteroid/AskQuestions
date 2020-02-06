import { TestBed } from '@angular/core/testing';

import { PostManagerService } from './post-manager.service';

describe('PostManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostManagerService = TestBed.get(PostManagerService);
    expect(service).toBeTruthy();
  });
});
