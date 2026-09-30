import bcrypt from "bcryptjs";

export const generateHash = async (value: string) => {
  const hashedValue = await bcrypt.hash(value, 12);
  return hashedValue;
};

export const compareHash = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};

type ItemPrices = {
  basePrice: number;
  extras?: { extraId: string; price: number }[];
  quantity: number;
  sizePrice: number;
};

export const calculateItemSubtotal = ({
  basePrice,
  extras = [],
  quantity,
  sizePrice,
}: ItemPrices) => {
  const extrasTotalPrice = extras.reduce((prev, curr) => prev + curr.price, 0);

  return Math.ceil((basePrice + extrasTotalPrice + sizePrice) * quantity);
};

type OrderPrices = {
  items: ItemPrices[];
};

export const calculateOrderSubtotal = ({ items }: OrderPrices): number => {
  return Math.ceil(
    items.reduce((prev, cur) => prev + calculateItemSubtotal(cur), 0),
  );
};
export const getPriceAfterDiscount = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};
