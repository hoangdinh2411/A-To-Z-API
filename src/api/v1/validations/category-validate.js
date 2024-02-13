const yup = require('yup');

const categoryValidation = {
  category: yup.object().shape({
    category_name: yup.string().required('Tên danh mục không được để trống'),
  }),
  subcategories: yup.object().shape({
    subcategories: yup
      .array()
      .of(yup.string().required('Tên danh mục con không được để trống'))
      .min(1, 'Phải có ít nhất 1 danh mục con'),
    category_id: yup.string().required('Phải có danh mục cha'),
  }),
};
module.exports = categoryValidation;
