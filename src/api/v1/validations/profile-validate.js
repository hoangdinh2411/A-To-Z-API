const yup = require('yup');

const profileValidation = {
  admin: yup.object().shape({
    email: yup.string().email().required('Email không được để trống'),
    company_name: yup.string().required('Tên công ty không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    main_office: yup.string().required('Trụ sở chính không được để trống'),
    office: yup.string().required('Văn phòng không được để trống'),
    description: yup.string().required('Mô tả không được để trống'),
  }),
  partner: yup.object().shape({
    email: yup.string().email().required('Email không được để trống'),
    company_name: yup.string().required('Tên công ty không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    main_office: yup.string().required('Trụ sở chính không được để trống'),
    office: yup.string(),
    description: yup.string().required('Mô tả không được để trống'),
    category: yup.string().required('Phải có danh mục sản phẩm'),
    representative: yup.string().required('Phải có tên người đại diện'),
    representative_phone: yup.string().required('Phải có số điện thoại người đại diện'),
    tax_code: yup.string().required('Phải có mã số thuế'),
    director: yup.string().required('Phải có tên giám đốc'),
    brand: yup.string().required('Phải có tên thương hiệu'),
    is_industrial_park: yup.boolean().required('Phải có thông tin khu công nghiệp'),
  }),
};
module.exports = profileValidation;
