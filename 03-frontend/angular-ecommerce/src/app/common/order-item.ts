import { CartItem } from "./cart-item";

export class OrderItem {
  public imageUrl: string | undefined;
  public unitPrice: number | undefined;
  public quantity: number | undefined;
  public productId: number | undefined;

  constructor(
    public cartItem: CartItem
  ) {
    this.imageUrl = cartItem.imageUrl;
    this.unitPrice = cartItem.unitPrice;
    this.quantity = cartItem.quantity;
    this.productId = cartItem.id;
  }
}
