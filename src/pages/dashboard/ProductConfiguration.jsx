import React from 'react';
import { Tabs, Form, Input, Button } from 'antd';
import Brand from '../../screens/productscreens/Brand'
import Category from '../../screens/productscreens/Category'
import Product from '../../screens/productscreens/Product'
import ProductDetails from '../../screens/productscreens/ProductDetails'

const { TabPane } = Tabs;

const ProductConfiguration = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Brand" key="1">
          <Brand />
        </TabPane>
        <TabPane tab="Category" key="2">
          <Category />
        </TabPane>
        <TabPane tab="Product" key="3">
          <Product />
        </TabPane>
        <TabPane tab="Product Details" key="4">
          <ProductDetails />
        </TabPane>
      </Tabs>
    </div>
  );
};

// const Brand = () => {
//   const [form] = Form.useForm();
//   const onFinish = values => {
//     console.log('Brand Form Values: ', values);
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish}>
//       <Form.Item name="brandName" label="Brand Name" rules={[{ required: true, message: 'Please enter brand name' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//   );
// };

// const Category = () => {
//   const [form] = Form.useForm();
//   const onFinish = values => {
//     console.log('Category Form Values: ', values);
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish}>
//       <Form.Item name="categoryName" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//   );
// };

// const Product = () => {
//   const [form] = Form.useForm();
//   const onFinish = values => {
//     console.log('Product Form Values: ', values);
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish}>
//       <Form.Item name="productName" label="Product Name" rules={[{ required: true, message: 'Please enter product name' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="productPrice" label="Product Price" rules={[{ required: true, message: 'Please enter product price' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//   );
// };

// const ProductDetails = () => {
//   const [form] = Form.useForm();
//   const onFinish = values => {
//     console.log('Product Details Form Values: ', values);
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish}>
//       <Form.Item name="productDescription" label="Product Description" rules={[{ required: true, message: 'Please enter product description' }]}>
//         <Input.TextArea />
//       </Form.Item>
//       <Form.Item name="productSKU" label="Product SKU" rules={[{ required: true, message: 'Please enter product SKU' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//   );
// };

export default ProductConfiguration;
