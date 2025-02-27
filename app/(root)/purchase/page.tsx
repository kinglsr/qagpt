"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  createCheckoutSession,
  getStripeProductsAndPrices,
} from "@/app/api/stripe/checkout_sessions";
import { Product } from "@/types/index";
import { Button } from "@/components/ui/button";

const ShoppingCard = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const productsList: any = await getStripeProductsAndPrices();
      // eslint-disable-next-line no-undef, new-cap
      setProducts(productsList);
    }

    fetchProducts();
  }, []);

  const handleBuy = async (productId: string) => {
    // Handle buy logic here
    try {
      await createCheckoutSession(productId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        id="alert-additional-content-2"
        className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="me-2 size-4 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            For Enterprise Plans, Please contact us at: &nbsp;
            <a href="mailto:support@qagpt.co">support@qagpt.co</a>
          </h3>
        </div>
        <Button
          className="paragraph-medium min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
          onClick={() => {
            // Replace "/purchase" with the actual route for purchasing
            window.location.href = "/contact-us";
          }}
        >
          Contact US
        </Button>
      </div>
      <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
        <div className="flex flex-wrap justify-center gap-10">
          {products
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <div key={product.id}>
                <Image
                  src={
                    product.name === "Two hour session"
                      ? "/assets/images/2 hour.jpeg"
                      : "/assets/images/1 hour.jpeg"
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  blurDataURL="data:..."
                  placeholder="blur"
                />
                <p className="h2-bold text-dark200_light800 my-3.5 max-w-md text-center">
                  {product.name}
                </p>
                <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
                  {product.description}
                </p>
                <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
                  Price: {product.currency.toUpperCase()}{" "}
                  <span style={{ textDecoration: "line-through" }}>
                    {product.name === "1 hour session" ? 49.99 : 69.99}
                  </span>
                </p>
                <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
                  {product.currency.toUpperCase()}{" "}
                  {product.unit_amount ? Number(product.unit_amount) / 100 : ""}
                </p>

                <Button
                  className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
                  onClick={() => handleBuy(product.default_price)}
                >
                  Buy Now
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCard;
