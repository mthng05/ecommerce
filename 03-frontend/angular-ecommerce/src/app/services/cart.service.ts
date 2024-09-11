import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  storageKey: string = 'cartItems';

  constructor() { 
    // this.cartItems.push(new CartItem(1, "crash in python", "assets/images/products/books/book-luv2code-1000.png", 12.00, 3, 12));
    // this.cartItems.push(new CartItem(2, "crash in python", "assets/images/products/books/book-luv2code-1000.png", 12.00, 3, 12));
    // this.cartItems.push(new CartItem(3, "crash in python", "assets/images/products/books/book-luv2code-1000.png", 12.00, 3, 12));

    // assign cartItems from localstorage
    this.loadCartItemsFromStorage();
    this.calculateTotals();
  }

  clearCartItem() {
    this.cartItems = [];
    this.totalPrice.next(0);
    this.totalQuantity.next(0);
    localStorage.removeItem(this.storageKey);
  }

  private loadCartItemsFromStorage() {
    const storedCartItems = localStorage.getItem(this.storageKey);
    if (storedCartItems) this.cartItems = JSON.parse(storedCartItems);
  }

  private saveCartItemsToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  addToCart(cartItem: CartItem) {
    let existingCartItem = this.cartItems.find(item => item.id == cartItem.id);

    if (existingCartItem) {
      if (cartItem.unitInStocks > existingCartItem.quantity) existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.calculateTotals(); 
    this.saveCartItemsToStorage();
  }

  calculateTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let cartItem of this.cartItems) {
      if (cartItem.unitPrice) {
        totalPriceValue += cartItem.unitPrice * cartItem.quantity;
      }
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else this.calculateTotals();

    this.saveCartItemsToStorage();
  }

  remove(cartItem: CartItem) {
    let existingCartItemIndex = this.cartItems.findIndex(item => item.id == cartItem.id);
    
    if (existingCartItemIndex > -1) {
      this.cartItems.splice(existingCartItemIndex, 1);
      this.calculateTotals();
    }

    this.saveCartItemsToStorage();
  }
}
