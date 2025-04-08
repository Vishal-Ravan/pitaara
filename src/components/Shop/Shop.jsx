import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Products } from "components/Product/Products/Products";
import { PagingList } from "components/shared/PagingList/PagingList";
import { usePagination } from "components/utils/Pagination/Pagination";
import Slider from "rc-slider";
import Dropdown from "react-dropdown";
import { AsideItem } from "../shared/AsideItem/AsideItem";

// React Range
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const sortOptions = [
  { value: "highToLow", label: "From expensive to cheap" },
  { value: "lowToHigh", label: "From cheap to expensive" },
];

export const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [category, setCategory] = useState("all");
  const [productsItem, setProductsItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("highToLow");
  const router = useRouter();

  // Fetch category from URL query
  useEffect(() => {
    const urlCategory = router.query.category;
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [router.query.category]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProductsItem(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let updatedProducts = [...productsItem];

    // Filter by Category
    if (category && category !== "all") {
      updatedProducts = updatedProducts.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Search Filter
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Range Filter
    updatedProducts = updatedProducts.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sorting
    if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [category, searchQuery, priceRange, sortOrder, productsItem]);

  const paginate = usePagination(filteredProducts, 9);

  return (
    <div>
      <div className="shop">
        <div className="wrapper">
          <div className="shop-content">
            <div className="shop-aside">
              <div className="box-field box-field__search">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="icon-search"></i>
              </div>
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Categories</span>
                <ul>
                  <li>
                    <a href="#" onClick={() => setCategory("all")}>
                      All Products
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => setCategory("Rings")}>
                      Rings
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => setCategory("Bracelets")}>
                      Bracelets
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => setCategory("Earrings")}>
                      Earrings
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => setCategory("Necklace")}>
                      Necklace
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => setCategory("Anklet")}>
                      Anklet
                    </a>
                  </li>
                </ul>
              </div>
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Price</span>
                <div className="range-slider">
                  <Range
                    min={0}
                    max={10000}
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

            <div className="shop-main">
              <div className="shop-main__filter">
                <div className="shop-main__select">
                  <Dropdown
                    options={sortOptions}
                    className="react-dropdown"
                    onChange={(option) => setSortOrder(option.value)}
                    value={sortOptions.find((opt) => opt.value === sortOrder)}
                  />
                </div>
              </div>

              <div className="shop-main__items">
                <Products products={filteredProducts} />
              </div>

              <PagingList paginate={paginate} />
            </div>
          </div>
        </div>
        <img className="promo-video__decor js-img" src="/assets/img/promo-video__decor.jpg" alt="" />
        <img className="shop-decor js-img" src="/assets/img/shop-decor.jpg" alt="" />
      </div>
    </div>
  );
};
