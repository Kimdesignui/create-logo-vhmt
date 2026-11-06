# Logo Studio · create-logo-vhmt

Công cụ web ghép logo và nội dung chữ thành một bố cục hoàn chỉnh, hỗ trợ xử lý logo cục bộ và xuất PNG, JPG hoặc SVG.

## Mở công cụ

- Bản online: [https://create-logo-vhmt.pages.dev/](https://create-logo-vhmt.pages.dev/)
- Chạy trên máy:

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal, thông thường là `http://localhost:5173/`.

## Quy trình sử dụng nhanh

1. Tải logo bằng cách bấm **Chọn hoặc kéo thả logo**.
2. Chọn một trong các thao tác xử lý logo nếu cần:
   - **Tách nền AI**: chuyển phần nền trắng liên thông bên ngoài thành trong suốt, giữ vùng trắng bên trong họa tiết.
   - **Tăng nét AI**: tăng kích thước, tương phản, độ bão hòa và độ rõ cạnh bằng xử lý ngay trên máy.
3. Nhập **Content phụ** và **Content chính**.
4. Chọn màu, cỡ chữ và font riêng cho từng dòng.
5. Chỉnh kích thước logo, khoảng cách giữa logo và text, padding.
6. Kiểm tra vùng **Bố cục xuất file**.
7. Chọn định dạng và bấm **Xuất file**.

## Logo đầu vào

Hỗ trợ SVG, PNG, JPG/JPEG và WEBP.

- SVG phù hợp khi cần giữ độ sắc nét và khả năng phóng to.
- PNG hỗ trợ nền trong suốt.
- JPG phù hợp với ảnh logo có nền phẳng.

Khi tải SVG, công cụ đọc viewBox của SVG để giữ đúng tỉ lệ. Một số SVG cũ có thể chứa lớp màu chồng hoặc nền trắng; hãy dùng **Tách nền AI** nếu cần làm sạch nền raster.

## Nội dung chữ

Công cụ có hai dòng độc lập:

- **Content phụ**: dùng cho tên đơn vị, dòng mô tả hoặc tiêu đề phụ.
- **Content chính**: dùng cho tên trường, tên bệnh viện hoặc tên thương hiệu.

Mỗi dòng có thể chọn riêng nội dung, màu chữ, cỡ chữ và font chữ.

Các font có sẵn gồm UTM Helve, UTM Helve Bold, UTM HelvetIns, Be Vietnam Pro, Roboto, Noto Sans và font hệ thống. Các font UTM được đóng gói trong `public/assets/fonts`; font Google có thể cần kết nối mạng để hiển thị đúng trong trình duyệt.

Nút **Tự động viết hoa** chuyển nội dung sang chữ hoa theo quy tắc tiếng Việt. Khi bật **Tự xuống dòng khi không đủ chiều rộng**, nội dung dài sẽ được chia dòng theo vùng text.

## Hai chế độ bố cục

### Ghép logo với text mới

Đây là chế độ mặc định. Công cụ dùng logo đầu vào làm biểu trưng và chèn hai dòng text ở bên phải. Text được căn giữa theo chiều cao biểu trưng.

Việc căn giữa dùng phần thân chữ làm mốc; dấu tiếng Việt như sắc, huyền, mũ, móc… vẫn được vẽ nhưng không làm lệch tâm của thân chữ.

### Giữ nguyên bố cục logo gốc

Bật **Giữ nguyên bố cục logo gốc** khi file đầu vào đã có sẵn cả biểu tượng và chữ. Ở chế độ này, công cụ không chèn thêm Content phụ hoặc Content chính.

## Kích thước logo và bố cục

### Kích thước biểu trưng

- **Biểu trưng rộng (px)**: chiều rộng logo trong file xuất.
- **Biểu trưng cao (px)**: chiều cao logo trong file xuất.
- **Giữ tỉ lệ biểu trưng**: khi bật, thay đổi một chiều sẽ tự tính chiều còn lại theo tỉ lệ ảnh gốc.

Kích thước logo phải là số nguyên từ `1` đến `8000`.

### Kích thước bố cục

Kích thước bố cục được tự tính từ:

```text
logo + khoảng cách + text + padding
```

Không cần nhập chiều rộng hoặc chiều cao tổng thể. Hai thông số hiển thị trong phần **Kích thước bố cục** là kích thước thực tế dùng để xuất file.

### Khoảng cách text tới logo

Điều chỉnh khoảng trống giữa biểu trưng và cụm text.

### Padding

Có bốn cạnh độc lập: trên, phải, dưới và trái.

Bật **Khóa padding 4 chiều** nếu muốn nhập một giá trị và đồng bộ cả bốn cạnh. Tắt khóa để chỉnh từng cạnh riêng. Padding nhận số nguyên từ `0` đến `8000`.

## Định dạng xuất

### PNG

- Nền trong suốt.
- Phù hợp đặt logo trên nhiều màu nền, website, tài liệu và thiết kế số.

### JPG

- File thường nhẹ hơn PNG.
- Phù hợp khi dùng trên nền trắng hoặc nền cố định.
- Không hỗ trợ nền trong suốt; vùng trong suốt sẽ được xuất thành nền trắng.

### SVG

- Độ sắc nét tốt khi phóng to.
- Phù hợp in ấn, chỉnh sửa tiếp trong Illustrator hoặc phần mềm vector.
- Text được chuyển thành `<path>` (vector), không phụ thuộc font có sẵn trên máy nhận file.
- Nếu logo đầu vào là PNG/JPG, phần logo vẫn là ảnh nhúng; chuyển text thành vector không tự biến ảnh raster thành vector.

## Preview và file xuất

Preview được tạo từ cùng một SVG layout với file xuất, vì vậy vị trí logo, text, khoảng cách và padding phải khớp nhau. Preview có thể được thu nhỏ để vừa vùng màn hình; các số px hiển thị vẫn là kích thước thật của file xuất.

## Quyền riêng tư

Các thao tác tải logo, tách nền và tăng nét hiện được xử lý cục bộ trong trình duyệt. Ảnh không được gửi lên máy chủ cho hai thao tác này.

Khi dùng font Google, trình duyệt có thể tải font từ dịch vụ font tương ứng nếu font chưa có sẵn trong bộ nhớ trình duyệt.

## Lỗi thường gặp

### Text quá nhỏ

Kiểm tra cỡ chữ của từng dòng. Cỡ chữ mặc định là `16px`; có thể tăng bằng thanh điều chỉnh.

### Logo và text không cân đối

Kiểm tra lần lượt kích thước biểu trưng, khoảng cách text tới logo, cỡ chữ hai dòng và padding bốn cạnh.

### Không xuất được file

Kiểm tra các trường kích thước logo và padding. Logo phải là số nguyên dương; padding phải là số nguyên không âm. Trường sai sẽ được đánh dấu và hệ thống không cho xuất file.

### SVG hiển thị khác trên máy khác

Text đã được chuyển thành path. Nếu phần logo đầu vào là PNG/JPG, phần ảnh đó vẫn phụ thuộc vào ảnh nhúng; hãy dùng SVG gốc nếu cần logo vector hoàn toàn.

## Phát triển và triển khai

```bash
npm run build
```

Repo GitHub: [https://github.com/Kimdesignui/create-logo-vhmt](https://github.com/Kimdesignui/create-logo-vhmt)

Cloudflare Pages project: `create-logo-vhmt`
