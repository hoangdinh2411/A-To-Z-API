const yup = require('yup');

const contractValidation = yup.object().shape({
  customer_name: yup.string().required('Tên khách hàng không được để trống'),
  company: yup.string().required('Công ty không được để trống'),
  products: yup
    .array()
    .of(
      yup.object().shape({
        _id: yup.string().required('Sản phẩm không được để trống'),
        product_name: yup.string().required('Tên sản phẩm không được để trống'),
        quantity: yup
          .number()
          .min(1, 'Số lượng không được nhỏ hơn 1')
          .required('Số lượng không được để trống'),
      }),
    )
    .min(1, 'Ít nhất một sản phẩm')
    .required('Sản phẩm không được để trống'),
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  phone: yup.string().required('Số điện thoại không được để trống'),
});
module.exports = { contractValidation };
