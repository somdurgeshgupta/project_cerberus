import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs/operators';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Show loader before the request is sent
  loaderService.show();

  return next(req).pipe(
    // Hide loader after the request is completed
    finalize(() => loaderService.hide())
  );
};
