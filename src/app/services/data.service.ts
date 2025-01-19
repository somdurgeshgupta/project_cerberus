import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items = [
    {
      pk: 987,
      name: 'Swiggy',
      points: 150,
      display_img_url: 'https://bsmedia.business-standard.com/_media/bs/img/article/2023-07/17/full/1689574606-2001.png',
      quantity: 14,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: "Products"
    },
    {
      pk: 988,
      name: 'Cafe Coffe Day',
      points: 2,
      display_img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyV-cVoruzOO1v8HHHXVqkAzm7iLGpJBrVxA&s',
      quantity: 0,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: 'e-Voucher'
    },
    {
      pk: 989,
      name: 'Decathlon',
      points: 10,
      display_img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYZ8HJ9Sru0jI9zbzFZVC0qKR3UAR-3dZYoQ&s',
      quantity: 1,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: 'e-Voucher'
    },
    {
      pk: 987,
      name: 'Fair Price Gift Voucher',
      points: 150,
      display_img_url: 'https://motoristprod.s3.amazonaws.com/uploads/reward/image/19/Fairprice_Voucher-new.png',
      quantity: 14,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: 'Products'
    },
    {
      pk: 988,
      name: 'Allen Solly Voucher',
      points: 2,
      display_img_url: 'https://5.imimg.com/data5/SELLER/Default/2022/11/KQ/DY/RJ/77252044/allen-solly-gift-card-500x500.png',
      quantity: 0,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: 'Fashion & Retail'
    },
    {
      pk: 989,
      name: 'Amazon Gift Card',
      points: 10,
      display_img_url: 'https://santa.shakepe.com/images/detailed/62/AMAZON_Shopping.png',
      quantity: 1,
      valid_until: '2024-12-31T00:00:00',
      low_quantity: 10,
      category: 'Fashion & Retail'
    }
  ];

  getItems() {
    return this.items;
  }
}