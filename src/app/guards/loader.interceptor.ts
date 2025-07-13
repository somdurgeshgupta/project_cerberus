import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
// import { LoaderService } from '../services/loader.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { finalize } from 'rxjs/operators';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoadingBarService);

  // Show loader before the request is sent
  const ref = loaderService.useRef(); // create a loading bar reference
  ref.start();

  return next(req).pipe(
    // Hide loader after the request is completed
    finalize(() => ref.complete())
  );
};
