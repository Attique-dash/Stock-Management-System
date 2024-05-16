"use client"
import Header from "./Components/header";
import Swal from "sweetalert";
import { useState, useEffect } from "react";


export default function Home({ size = 30, strokeWidth = 5, color = '#3498db' }) {
  const [productForm, setProductForm] = useState({});
  const [newproductForm, setNewProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingerror, setExistingError] = useState('');
  const [hoverproduct, setHoverProduct] = useState(null);
  const [formval, setFormval] = useState(false);
  const [searchQurey, setSearchQurey] = useState("");
  const [searchdata, setSearchData] = useState([]);
  const [searchType, setSearchType] = useState('slug');
  const [editProduct, setEditProduct] = useState(null);


  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/product');
      const rjson = await response.json();
      console.log("Products fetched:", rjson.products);
      setProducts(rjson.products);
      setSearchData(rjson.products)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [])

  useEffect(() => {
    searchBar(searchQurey);
  }, [searchQurey, searchType]);

  const searchBar = (searchQurey) => {
    let filterData = searchdata;
    if (searchQurey) {
      filterData = searchdata.filter((product) =>
        product[searchType].toLowerCase().includes(searchQurey.toLowerCase())
      );
    }
    setProducts(filterData);
  };

  const handelChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  };

  const displayError = (errorMessage, setErrorFunc) => {
    setErrorFunc(errorMessage);
    setTimeout(() => {
      setErrorFunc(null);
    }, 3000);
  };

  const addProduct = async (e) => {

    const slugExists = products.some(product => product.slug === productForm.slug);

    if (!productForm?.slug || !productForm?.quantity || !productForm?.price) {
      displayError("Please fill in all fields.", setError)
      return;
    } else if (slugExists) {
      displayError("This product already exists.", setExistingError);
      setShowModal(true);
    } else {
      handleClick();
      try {
        const response = await fetch('/api/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'aplication/json'
          },
          body: JSON.stringify(productForm)
        });
        if (response.ok) {
          displayError("Your produt has been addad!", setAlert);
          setProductForm({});

        } else {
          console.log("Error added Product!");
        }
      } catch (error) {
        console.log('Error:', error)
      }
      fetchProduct();
      setShowModal(false);
      setFormval(false);
      e.preventDefault();
    }
  };


  const openModal = () => {
    setFormval(true);
    setShowModal(true);
    setEditProduct(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormval(false);
    setProductForm({});
  };

  const mousein = (slug) => {
    setHoverProduct(slug);
  };

  const mouseout = () => {
    setHoverProduct(null);
  };

  const deletebutton = async (slug) => {
    console.log(`Deleting item with slug: ${slug}`);
    Swal({
      title: 'Are you sure?',
      text: 'It will be permanently deleted!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        Swal('Deleted!', 'Your product has been deleted.', 'success');
        try {
          const response = await fetch(`/api/action/${slug}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          if (response.ok) {
            console.log("Your product has been deleted successfully!");
            setFormval(false);
          } else {
            console.error("Error deleting object!", response.statusText);
          }
        } catch (error) {
          console.error('Error deleting:', error);
        }
      }
      fetchProduct();
    });
  };

  const handelChangetwo = (e) => {
    setNewProductForm({ ...newproductForm, [e.target.name]: e.target.value })
  };

  const editbutton = (product) => {
    setNewProductForm({
      slug: product.slug,
      quantity: product.quantity,
      price: product.price
    });
    setEditProduct(product);
    setFormval(true);
    setShowModal(true);
  }

  const UpdateProduct = async (slug) => {
    console.log(`ID: ${slug}`);
    console.log(`Updated Product Data: ${JSON.stringify(newproductForm)}`);

    try {
      const response = await fetch(`/api/action/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newproductForm)
      });

      if (response.ok) {
        console.log("Product updated successfully!");
      } else {
        console.log("Error updating product:", response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }

    setShowModal(false);
    fetchProduct();
    setFormval(false);
    setEditProduct(null);
    setNewProductForm({});
  };



  const handleClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
    }, 5000);
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center">
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Add Product
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg" style={{ width: '80%' }}>
              <div className="flex justify-end">
                <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {editProduct ? (
                <h1 className="text-3xl text-center font-semibold mb-6">Edit a product</h1>
              ) : (
                <h1 className="text-3xl text-center font-semibold mb-6">Add a product</h1>
              )}
              <hr />
              <div className="mt-4">
              {editProduct ? (
                  <div className="container my-8 mx-auto">
                    <div className="mb-4">
                      <label htmlFor="productName" className="block mb-2">Product Slug:</label>
                      <input value={newproductForm?.slug || ""} name="slug" onChange={handelChangetwo} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productQuantity" className="block mb-2">Product Quantity:</label>
                      <input value={newproductForm?.quantity || ""} name="quantity" onChange={handelChangetwo} type="number" id="productQuantity" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productPrice" className="block mb-2">Product Price:</label>
                      <input value={newproductForm?.price || ""} name="price" onChange={handelChangetwo} type="number" id="productPrice" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                  </div>
                ) : (
                  <div className="container my-8 mx-auto">
                    <div className="mb-4">
                      <label htmlFor="productName" className="block mb-2">Product Slug:</label>
                      <input value={productForm?.slug || ""} name="slug" onChange={handelChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productQuantity" className="block mb-2">Product Quantity:</label>
                      <input value={productForm?.quantity || ""} name="quantity" onChange={handelChange} type="number" id="productQuantity" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productPrice" className="block mb-2">Product Price:</label>
                      <input value={productForm?.price || ""} name="price" onChange={handelChange} type="number" id="productPrice" className="w-full border border-gray-300 px-4 py-2" />
                    </div>
                  </div>
                )}
                {error && (<p className="text-center mb-3 font-bold text-red-600 text-lg italic">{error} </p>)}
                {existingerror && (<p className="text-center mb-3 font-bold text-red-600 text-lg italic">{existingerror} </p>)}
                {editProduct ? (
                  <div className="flex justify-center">
                    <button
                      onClick={() => UpdateProduct(editProduct._id)}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold  w-40 pl-12 py-2 px-4 rounded inline-flex items-center ${buttonloading ? 'opacity-50 cursor-wait' : ''
                        }`}
                      disabled={buttonloading}
                    >
                      {buttonloading ? (
                        <svg
                          width={size}
                          height={size}
                          viewBox={`0 0 ${size} ${size}`}
                          xmlns="http://www.w3.org/2000/svg"
                          stroke={color}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                        >
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={(size - strokeWidth) / 2}
                            fill="none"
                            className="stroke-current"
                          />
                        </svg>
                      ) : (
                        'Update'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={addProduct}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold  w-40 pl-14 py-2 px-4 rounded inline-flex items-center ${buttonloading ? 'opacity-50 cursor-wait' : ''
                        }`}
                      disabled={buttonloading}
                    >
                      {buttonloading ? (
                        <svg
                          width={size}
                          height={size}
                          viewBox={`0 0 ${size} ${size}`}
                          xmlns="http://www.w3.org/2000/svg"
                          stroke={color}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                        >
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={(size - strokeWidth) / 2}
                            fill="none"
                            className="stroke-current"
                          />
                        </svg>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="container my-8  mx-auto">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-xl font-semibold mb-6">Search a product</h1>
        <div className="flex mb-2">
          <input
            type={searchType === 'quantity' || searchType === 'price' ? 'number' : 'text'}
            className="w-full border border-gray-300 px-4 py-2"
            placeholder={`Search for a ${searchType}...`}
            value={searchQurey}
            onChange={(e) => setSearchQurey(e.target.value)}
          />
          <select
            id="searchType"
            className="ml-4 border-gray-300 px-4 py-2"
            name="searchType"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="slug">Slug</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
      <div className="container my-8  mx-auto">
        <h1 className="text-xl font-semibold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => {
              return formval ? (<tr key={product.slug} >
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">₹{product.price}</td>
              </tr>
              ) : (
                <tr
                  key={product.slug}
                  onMouseEnter={() => mousein(product.slug)}
                  onMouseLeave={mouseout}
                  className={`relative ${hoverproduct === product.slug ? 'bg-gray-100' : ''}`}
                >
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">PKR {product.price}</td>
                  {hoverproduct === product.slug && (
                    <td className="absolute top-0 right-0 mt-2 mr-2">
                      <div className="flex gap-3">
                        <button onClick={() => editbutton(product)} className="bg-blue-500 hover:bg-blue-600 text-white rounded pl-3" style={{ height: '25px', width: '50px' }}>
                          <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                          </svg>
                        </button>
                        <button onClick={() => deletebutton(product._id)} className="bg-red-500 hover:bg-red-600 text-white rounded pl-3" style={{ height: '25px', width: '50px' }}>
                          <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

