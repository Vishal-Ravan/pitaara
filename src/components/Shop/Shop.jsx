import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Products } from "components/Product/Products/Products";
import { PagingList } from "components/shared/PagingList/PagingList";
import { usePagination } from "components/utils/Pagination/Pagination";
import Slider from "rc-slider";
import Dropdown from "react-dropdown";
import { AsideItem } from "../shared/AsideItem/AsideItem";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const sortOptions = [
  { value: "highToLow", label: "Price High To Low" },
  { value: "lowToHigh", label: "Price Low To High" },
];

export const Shop = () => {
  const router = useRouter();
  const { category: categoryFromURL, q: searchQueryFromURL } = router.query;

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [productsItem, setProductsItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchQueryFromURL || "");
  const [sortOrder, setSortOrder] = useState("highToLow");
  const [category, setCategory] = useState(categoryFromURL || "all");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProductsItem(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category, search, price, and sort
  useEffect(() => {
    let updatedProducts = [...productsItem];

    // Apply Category Filter
    if (category && category !== "all") {
      updatedProducts = updatedProducts.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply Search Filter
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Price Filter
    updatedProducts = updatedProducts.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply Sort Filter
    if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [category, searchQuery, priceRange, sortOrder, productsItem]);

  const paginate = usePagination(filteredProducts, 9);

  // Handle Category Change
  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
    setSearchQuery(""); // Clear search query when changing category
    router.push({
      pathname: "/shop",
      query: { category: categoryValue }, // Update URL query
    });
  };

  return (
    <div>
      <div className="shop">
        <div className="wrapper">
          <div className="shop-content">
            <div className="shop-aside">
              {/* Search bar */}
              <div className="box-field box-field__search">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    const newQuery = e.target.value;
                    setSearchQuery(newQuery);
                    router.push({
                      pathname: "/shop",
                      query: { ...router.query, q: newQuery },
                    });
                  }}
                />
                <i className="icon-search"></i>
              </div>

              {/* Category Filter */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Categories</span>
                <ul className="category-list desktop-only">
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange("all"); // Show all products
                      }}
                    >
                      All Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange("rings");
                      }}
                    >
                      Rings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange("bracelets");
                      }}
                    >
                      Bracelets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange("earrings");
                      }}
                    >
                      Earrings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange("necklaces");
                      }}
                    >
                      Necklaces
                    </a>
                  </li>
                </ul>
              </div>

              {/* Price Range */}
              <div className="shop-aside__item price">
                <span className="shop-aside__item-title">Price</span>
                <div className="range-slider">
                  <Range
                    min={0}
                    max={1000}
                    defaultValue={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    tipFormatter={(value) => `${value} Rupees`}
                    allowCross={false}
                    tipProps={{
                      placement: "bottom",
                      prefixCls: "rc-slider-tooltip",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="shop-main">
              <div className="shop-main__items">
                <Products products={filteredProducts} />
              </div>

              <PagingList paginate={paginate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
