export class CartItem {
  constructor(
    public id: number | undefined,
    public name: string | undefined,
    public imageUrl: string | undefined,
    public unitPrice: number | undefined,
    public quantity: number = 1,
    public unitInStocks: number = 0
  ) {}
}