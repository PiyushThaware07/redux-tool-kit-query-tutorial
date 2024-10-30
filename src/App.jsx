import React, { useState } from 'react'
import { useAddProductMutation, useDeleteProductMutation, useGetProductsQuery } from './store/api.slice';

export default function App() {
  const { data, isLoading, isError, isSuccess } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error...</h1>
  if (isSuccess)
    return (
      <div>
        <AddProductComponent />
        <table border={2} cellPadding={10}>
          <thead>
            <tr>
              <td>#</td>
              <td>title</td>
              <td>category</td>
              <td>price</td>
              <td>remove</td>
            </tr>
          </thead>
          <tbody>
            {
              data?.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                  <td><button type='button' onClick={() => deleteProduct(item.id)}>delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
}







function AddProductComponent() {
  const [formData, setFormData] = useState({ title: "title", category: "category", description: "description", price: "price", image: "image" });
  const [addProductFunction, { isLoading, isError, isSuccess }] = useAddProductMutation();
  function handleChange(e) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addProductFunction(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={formData.title} onChange={handleChange} name='title' placeholder='title' />
      <input type="text" value={formData.price} onChange={handleChange} name='price' placeholder='price' />
      <input type="text" value={formData.description} onChange={handleChange} name='description' placeholder='description' />
      <input type="text" value={formData.image} onChange={handleChange} name='image' placeholder='image' />
      <input type="text" value={formData.category} onChange={handleChange} name='category' placeholder='category' />
      <button type='submit' disabled={isLoading || isSuccess}>
        {isLoading ? 'Adding...' : (isSuccess ? 'Added!' : 'Add Product')}
      </button>
      {isError && <p>Error adding product!</p>}
    </form>
  )
}