import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
