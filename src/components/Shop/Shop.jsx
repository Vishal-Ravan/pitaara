import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Products } from "components/Product/Products/Products";
import ReactDropdown from "react-dropdown";

const sortOptions = [
  { value: "highToLow", label: "Price High To Low" },
  { value: "lowToHigh", label: "Price Low To High" },
];

export const Shop = () => {
  const router = useRouter();
  const [productsItem, setProductsItem] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("highToLow");
  const [category, setCategory] = useState(router.query.category || "all");
  const [searchTerm, setSearchTerm] = useState(router.query.search || "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`);
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

  // Sync query params from URL
  useEffect(() => {
    setCategory(router.query.category || "all");
    setSearchTerm(router.query.search || "");
  }, [router.query]);

  // Filter and sort
  useEffect(() => {
    let updatedProducts = [...productsItem];

    // Filter by category
    if (category !== "all") {
      updatedProducts = updatedProducts.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      updatedProducts = updatedProducts.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [category, sortOrder, searchTerm, productsItem]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (categoryValue) => {
    router.push({
      pathname: "/shop",
      query: { category: categoryValue, search: searchTerm },
    }, undefined, { shallow: true });
  };

  return (
    <div>
      <div className="shop">
        <div className="wrapper">
          <div className="shop-content">
            <div className="shop-aside">
              {/* Sort Filter */}
              <div className="mob-fil">
                <div className="shop-main__filter">
                  <div className="shop-main__select">
                    <ReactDropdown
                      options={sortOptions}
                      className="react-dropdown"
                      onChange={(option) => setSortOrder(option.value)}
                      value={sortOptions.find((opt) => opt.value === sortOrder)}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Categories</span>
                <ul className="category-list desktop-only">
                  {["all", "rings", "bracelets", "earrings", "necklaces"].map((cat) => (
                    <li key={cat}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryChange(cat);
                        }}
                      >
                        {cat === "all"
                          ? "All Products"
                          : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Grid */}
            <div className="shop-main">
              <div className="shop-main__items">
                <Products products={paginatedProducts} />
              </div>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={index + 1 === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
