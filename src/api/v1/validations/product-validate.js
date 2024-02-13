const yup = require('yup');

const imageValidation = yup.object().shape({
  url: yup.string().required('Đường dẫn ảnh không được để trống'),
  public_id: yup.string().required('Phải có public_id'),
});

const colorValidation = yup.object().shape({
  color_name: yup.string().required('Tên màu không được để trống'),
  color_code: yup.string().required('Mã màu không được để trống'),
});

const productValidation = yup.object().shape({
  product_name: yup.string().required('Tên sản phẩm không được để trống'),
  price: yup.number().required('Giá sản phẩm không được để trống'),
  currency: yup.string().required('Loại tiền tệ không được để trống'),
  size: yup.string().required('Kích thước không được để trống'),
  weight: yup.number().required('Khối lượng không được để trống'),
  material: yup.string().required('Chất liệu không được để trống'),
  highlight_features: yup.string().required('Đặc điểm nổi bật không được để trống'),
  description: yup.string().required('Mô tả không được để trống'),
  short_description: yup.string().required('Mô tả ngắn không được để trống'),
  images: yup
    .array()
    .of(imageValidation)
    .max(4, 'Ảnh tối đa 4 ảnh')
    .min(1, 'Ảnh tối thiểu 1 ảnh')
    .required('Phải có ít nhất 1 ảnh'),
  colors: yup.array().of(colorValidation),
  subcategory: yup.string().required('Phải có danh mục con'),
});

module.exports = productValidation;
