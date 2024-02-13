const ERROR_MESSAGES = {
  ROLE: {
    NOT_FOUND: 'Role này chưa được khởi tạo',
    EXISTING: 'Role này đã được khởi tạo',
    PERMISSIONS_LIST_INVALID: 'Danh sách permissions không hợp lệ',
  },
  PERMISSION: {
    NOT_FOUND: 'Permission này chưa được khởi tạo',
    EXISTING: 'Permission này đã được khởi tạo',
  },
  USER: {
    NOT_FOUND: 'Tài khoản này không tồn tại',
    BANNED: 'Tài khoản này đã bị khóa',
    EXISTING: 'Tài khoản này đã tồn tại',
  },
  AUTH: {
    WRONG_USERNAME: 'Tài khoản không đúng',
    WRONG_PASSWORD: 'Mật khẩu không đúng',
    MISSING_TOKEN: 'Không tìm thấy token',
    INVALID_TOKEN: 'Token không hợp lệ',
    PERMISSION_DENIED: 'Bạn không có quyền thực hiện chức năng này',
  },
  PRODUCT: {
    NOT_FOUND: 'Sản phẩm này chưa được khởi tạo',
    EXISTING: 'Sản phẩm này đã được khởi tạo',
  },

  CATEGORY: {
    NOT_FOUND: 'Danh mục này chưa được khởi tạo',
    EXISTING: 'Danh mục này đã được khởi tạo',
  },
  SUBCATEGORY: {
    NOT_FOUND: 'Danh mục con này chưa được khởi tạo',
    EXISTING: 'Danh mục con này đã được khởi tạo',
  },
  MEDIA: {
    INCORRECT_TYPE: 'Loại file không hợp lệ',
    MISSING_PUBLIC_ID: 'Không tìm thấy public_id',
    DESTROY_IMAGE_FAILED: 'Xóa images thất bại',
  },
};
module.exports = { ERROR_MESSAGES };
