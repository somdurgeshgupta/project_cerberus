import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent {
  items: any[] = [];
  filteredItems: any[] = [];
  paginatedItems: any[] = [];
  searchTerm: string = '';
  searchTermSubject: Subject<string> = new Subject<string>();
  showSortMenu: boolean = false;
  selectedCategories: any = {
    'e-Voucher': false,
    'Products': false,
    'Fashion & Retail': false
  };
  selectedCategoryCount: number = 0;
  categoryList = [
    { key: 'e-Voucher', name: 'e-Voucher' },
    { key: 'Products', name: 'Products' },
    { key: 'Fashion & Retail', name: 'Fashion & Retail' }
  ];
  page: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.items = this.dataService.getItems();
    this.filteredItems = [...this.items];
    this.calculateTotalPages();
    this.updatePagination();
    this.updateSelectedCategoryCount();

    this.searchTermSubject.pipe(debounceTime(200)).subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.getSearchResults();
    });
  }

  toggleSort(): void {
    this.showSortMenu = !this.showSortMenu;
  }

  sortItems(order: string): void {
    console.log('Before sorting:', this.filteredItems);
    this.filteredItems.sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    console.log('After sorting:', this.filteredItems);
    this.showSortMenu = false;
    this.updatePagination();
  }

  onSearchTermChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.value !== null) {
      this.searchTermSubject.next(target.value);
    }
  }
  

  getSearchResults(): void {
    this.page = 1;
    let results = [...this.items];

    if (Object.values(this.selectedCategories).some((value) => value)) {
      results = results.filter((item) =>
        Object.keys(this.selectedCategories).some(
          (category) =>
            this.selectedCategories[category] && item.category === category
        )
      );
    }

    if (this.searchTerm) {
      results = results.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredItems = results;
    this.calculateTotalPages();
    this.updatePagination();
  }

  applyCategoryFilter(): void {
    this.getSearchResults();
  }

  updatePagination(): void {
    this.paginatedItems = this.filteredItems.slice(
      (this.page - 1) * this.itemsPerPage,
      this.page * this.itemsPerPage
    );
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePagination();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  updateSelectedCategoryCount(): void {
    this.selectedCategoryCount = Object.values(this.selectedCategories).filter(
      (value) => value
    ).length;
  }

  removeCategoryFilter(category: any): void {
    this.selectedCategories[category] = false;
    this.applyCategoryFilter();
  }

}
