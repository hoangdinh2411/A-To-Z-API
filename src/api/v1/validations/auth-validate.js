const yup = require('yup');
const authValidation = {
  login: yup.object().shape({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(15, 'Mật khẩu phải có tối đa 15 ký tự')
      .required('Mật khẩu không được để trống'),
  }),
  register: yup.object().shape({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup.string().min(6).max(15).required('Mật khẩu không được để trống'),
    role: yup.string().required('Phải cấp vai trò  cho tài khoản'),
  }),
  role: yup.object().shape({
    role_name: yup.string().required('Tên vai trò không được để trống'),
    permissions: yup.array().of(yup.string('Phải có ít nhất 1 quyền')),
  }),
  permission: yup.object().shape({
    title: yup.string().required('Tên quyền không được để trống'),
  }),
};

module.exports = authValidation;
