import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    standalone: false,
  selector: 'img[appBrokenImage]'
})
export class BrokenImageDirective {
  @Input() appBrokenImage: string = '/basic_user.jpg'; // Default placeholder image

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.appBrokenImage;
    console.error(`Image failed to load, replaced with placeholder: ${this.appBrokenImage}`);
  }
}
