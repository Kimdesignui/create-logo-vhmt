# HƯỚNG DẪN SỬ DỤNG LOGO STUDIO

## 1. Mở công cụ

Truy cập:

<https://create-logo-vhmt.pages.dev/>

Công cụ hoạt động trực tiếp trên trình duyệt. Người dùng không cần cài phần mềm.

## 2. Tải logo lên

Tại khung **Logo gốc**:

1. Bấm **Chọn hoặc kéo thả logo**.
2. Chọn file logo từ máy tính.
3. Có thể dùng file SVG, PNG, JPG hoặc WEBP.
4. Logo sẽ xuất hiện ở khung xem trước bên trái và trong vùng **Bố cục xuất file** ở giữa.

## 3. Tách nền logo

Bấm **Tách nền AI** khi logo có nền trắng bên ngoài cần xóa.

Công cụ sẽ:

- Xóa vùng trắng liên thông ở bên ngoài logo.
- Giữ vùng trắng nằm bên trong họa tiết logo.
- Tạo nền trong suốt khi xuất PNG.

Nếu logo không có nền trắng bên ngoài, không cần bấm nút này.

## 4. Tăng nét logo

Bấm **Tăng nét AI** để làm rõ biên và màu logo.

Nên dùng chức năng này khi ảnh đầu vào bị nhỏ hoặc hơi mờ. Với logo SVG, thường không cần tăng nét vì SVG vốn đã giữ độ sắc nét khi phóng to.

## 5. Nhập nội dung chữ

Trong phần **Text đi kèm**, có hai ô nhập:

### Content phụ

Dùng cho dòng phụ, ví dụ:

```text
TRƯỜNG THPT
```

### Content chính

Dùng cho tên chính, ví dụ:

```text
THẢO NGUYÊN
```

Nếu không muốn dùng dòng phụ, xóa nội dung trong ô **Content phụ**.

## 6. Chỉnh từng dòng chữ

Mỗi dòng chữ có thể chỉnh riêng:

- **Màu content phụ/chính**: bấm ô màu để chọn màu.
- **Cỡ chữ**: kéo thanh điều chỉnh. Giá trị nhỏ nhất là 1px.
- **Font content phụ/chính**: chọn font trong danh sách.

Hai dòng có thể dùng hai font khác nhau.

Nút **Tự động viết hoa** giúp chuyển toàn bộ nội dung sang chữ hoa.

Nút **Tự xuống dòng khi không đủ chiều rộng** cho phép nội dung dài tự chia thành nhiều dòng.

Text được căn giữa theo phần thân chữ. Các dấu tiếng Việt vẫn được giữ nguyên nhưng không làm lệch tâm của dòng chữ.

## 7. Giữ nguyên logo đã có sẵn chữ

Nếu file logo đã bao gồm cả biểu tượng và chữ, bật:

**Giữ nguyên bố cục logo gốc**

Khi bật chế độ này, công cụ chỉ thay đổi kích thước và xuất lại logo, không chèn thêm hai dòng text.

## 8. Chỉnh kích thước logo

Trong phần **Kích thước biểu trưng**:

- Nhập **Biểu trưng rộng (px)**.
- Nhập **Biểu trưng cao (px)**.

Các giá trị phải là số nguyên từ 1 trở lên.

### Giữ tỉ lệ logo

Bật **Giữ tỉ lệ biểu trưng** nếu muốn logo không bị méo. Khi thay đổi chiều rộng hoặc chiều cao, chiều còn lại sẽ tự tính theo tỉ lệ gốc.

Tắt tùy chọn này nếu muốn tự do nhập cả chiều rộng và chiều cao.

## 9. Chỉnh khoảng cách giữa logo và chữ

Tại mục **Khoảng cách text tới logo**, kéo thanh điều chỉnh:

- Giá trị nhỏ: chữ gần logo hơn.
- Giá trị lớn: chữ cách logo xa hơn.
- Giá trị 0: không thêm khoảng cách giữa hai phần.

## 10. Chỉnh padding

Padding là khoảng trống bao quanh toàn bộ logo và text.

Có bốn ô:

- Padding trên.
- Padding phải.
- Padding dưới.
- Padding trái.

### Khóa padding 4 chiều

Bật **Khóa padding 4 chiều** nếu muốn bốn cạnh luôn bằng nhau.

Ví dụ:

1. Bật khóa.
2. Nhập `24` vào một ô padding.
3. Cả bốn ô sẽ tự chuyển thành `24`.

Tắt khóa nếu muốn chỉnh từng cạnh khác nhau.

Padding có thể bằng 0 và phải là số nguyên không âm.

## 11. Đọc kích thước file thực tế

Mục **Kích thước bố cục** hiển thị kích thước thật của file sau khi tính:

```text
logo + text + khoảng cách + padding
```

Không cần nhập chiều rộng hoặc chiều cao tổng thể. Khi thay đổi logo, chữ, khoảng cách hoặc padding, kích thước này sẽ tự cập nhật.

Vùng xem trước có thể được thu nhỏ để vừa màn hình, nhưng tỉ lệ giữa logo, text và khoảng cách vẫn giữ đúng với file xuất.

## 12. Chọn định dạng xuất

### PNG – nền trong suốt

Chọn PNG khi:

- Cần đặt logo lên nhiều màu nền.
- Cần giữ nền trong suốt.
- Dùng cho website, tài liệu hoặc thiết kế số.

### JPG – file nhẹ

Chọn JPG khi:

- Dùng logo trên nền trắng.
- Cần file ảnh nhẹ.
- Không cần nền trong suốt.

### SVG – vector sắc nét

Chọn SVG khi:

- Cần phóng to hoặc in ấn.
- Muốn mở tiếp trong Illustrator hoặc phần mềm vector.
- Muốn text không phụ thuộc font trên máy khác.

Text trong SVG sẽ được chuyển thành đường vector. Nếu logo gốc là PNG hoặc JPG thì phần logo gốc vẫn là ảnh raster.

## 13. Xuất file

1. Kiểm tra hình trong vùng **Bố cục xuất file**.
2. Chọn PNG, JPG hoặc SVG.
3. Bấm **Xuất file**.
4. File sẽ được tải xuống thư mục Download của trình duyệt.

Tên file được tạo theo tên logo đã tải lên.

## 14. Xử lý lỗi thường gặp

### Logo bị méo

Bật **Giữ tỉ lệ biểu trưng**.

### Chữ quá nhỏ

Tăng cỡ chữ riêng cho Content phụ hoặc Content chính.

### Chữ quá sát logo

Tăng **Khoảng cách text tới logo**.

### File PNG có nền trắng

Bấm **Tách nền AI** trước khi xuất và chọn PNG.

### Không xuất được file

Kiểm tra:

- Đã tải logo lên chưa.
- Chiều rộng và chiều cao logo có phải số nguyên từ 1 trở lên không.
- Padding có phải số nguyên từ 0 trở lên không.

### SVG hiển thị khác mong muốn

Ưu tiên dùng file logo SVG gốc. Nếu dùng PNG/JPG, phần logo vẫn phụ thuộc chất lượng ảnh gốc.

## 15. Lưu ý về dữ liệu

Logo được xử lý trực tiếp trên trình duyệt cho các chức năng tách nền và tăng nét. Ảnh không được gửi lên máy chủ để xử lý.
