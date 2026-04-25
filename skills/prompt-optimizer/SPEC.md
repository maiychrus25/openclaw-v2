# SPEC: Fix DAT Add Flow — QLHV Hệ Thống Quản Lý Học Viên

**Trạng thái:** Draft  
**Ngày:** 2026-04-24  
**Loại:** Bug Fix (FE + BE)  
**Mức độ:** MEDIUM  
**Người phụ trách:** `TODO`

---

## 1. Mô tả Bug

Hệ thống không thể thêm mới một bản ghi DAT (Driving Assessment Test) từ:
- Trang hồ sơ học viên (student detail panel)
- Trang tiến độ DAT

### Bug 1: FE gửi sai field → BE Zod validation lỗi

| Tầng | Field gửi/nhận | Vấn đề |
|------|----------------|--------|
| **FE gửi** | `course_student_id` (string) | Sai tên — BE không nhận ra |
| **FE gửi** | `session_type` (string) | BE không expect field này |
| **FE gửi** | `start_time` (string) | Sai tên field |
| **FE gửi** | `end_time` (string) | Sai tên field |
| **FE gửi** | `distance_km` (number) | BE không expect field này |
| **FE gửi** | `notes` (string) | BE không expect field này |
| **BE expect** | `enrollmentId` (string) | Khác `course_student_id` |
| **BE expect** | `date` (string) | Khác `start_time` |
| **BE expect** | `timeStart` (string) | Khác `start_time` |
| **BE expect** | `timeEnd` (string) | Khác `end_time` |

**Lỗi thực tế:** `ZodValidationError: "Invalid input: expected string, received undefined"` — vì `enrollmentId`, `date`, `timeStart`, `timeEnd` nhận được `undefined`.

### Bug 2: Form logic auto-calculation bị đảo ngược

**Sai (hiện tại):**
```
Nhập duration (phút) → tự nhảy end_time     ❌
Đổi start/end time    → tự tính duration    ❌
```

**Đúng (yêu cầu):**
```
Nhập duration (phút) → tự nhảy end_time     ✅
Đổi start/end time   → tự tính duration    ✅
```

---

## 2. Field Mapping — FE ↔ BE Chuẩn Hóa

Chọn một trong hai hướng giải quyết:

### Hướng A — FE điều chỉnh để match BE (Khuyến nghị nếu BE đã có schema ổn định)

FE gửi payload mới:

```typescript
// FE sửa payload trước khi gọi API
interface AddDATPayload {
  enrollmentId: string;   // map từ course_student_id
  date: string;           // map từ start_date hoặc hôm nay
  timeStart: string;      // map từ start_time (HH:mm)
  timeEnd: string;        // map từ end_time (HH:mm)
}
```

**Mapping logic:**
```
course_student_id → enrollmentId
start_date        → date          (YYYY-MM-DD)
start_time        → timeStart     (HH:mm)
end_time          → timeEnd       (HH:mm)
```

**Loại bỏ:** `session_type`, `distance_km`, `notes` — nếu BE không cần.

### Hướng B — BE điều chỉnh Zod schema để accept FE payload

```typescript
// BE sửa Zod schema
const AddDATSchema = z.object({
  course_student_id: z.string().uuid("course_student_id must be a valid UUID"),
  session_type: z.string().optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "HH:mm format"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "HH:mm format"),
  distance_km: z.number().positive().optional(),
  notes: z.string().optional(),
});
```

> ⚠️ **Quyết định:** Cần Lead xác nhận đi theo Hướng A hay Hướng B. Khuyến nghị **Hướng A** vì tránh thay đổi BE schema rộng.

---

## 3. Logic Form Đúng — Auto-Calculation

### 3.1 Khi user nhập duration (phút)

```
duration phút → end_time = start_time + duration
```

**Thứ tự:**
1. User nhập **start_time**
2. User nhập **duration** (số phút)
3. Hệ thống tự tính `end_time = start_time + duration phút`
4. **Ghi đè** field `end_time` (user không cần tự điền)

### 3.2 Khi user sửa start/end time

```
duration = end_time - start_time
```

**Thứ tự:**
1. User thay đổi **start_time** hoặc **end_time**
2. Hệ thống tự tính `duration phút = |end_time - start_time|`
3. **Ghi đè** field `duration` (hiển thị lại số phút)

### 3.3 Guardrails

- `start_time` < `end_time` (validate, nếu sai → show error, không auto-fix)
- `duration` ≥ 0 (nếu negative → reject)
- `start_time` mặc định = giờ hiện tại + 15 phút
- `duration` mặc định = 60 phút

---

## 4. Thay Đổi Backend (nếu chọn Hướng A)

### 4.1 Files cần sửa

| File | Thay đổi |
|------|----------|
| `server/src/controllers/DATController.ts` | Parse `enrollmentId`, `date`, `timeStart`, `timeEnd` |
| `server/src/services/DATService.ts` | Nhận đúng field, không dùng `course_student_id` |
| `server/src/repositories/DATRepository.ts` | Insert record với đúng field mapping |
| `server/src/schemas/DATSchema.ts` | Zod schema với `enrollmentId`, `date`, `timeStart`, `timeEnd` |

### 4.2 Zod Schema (Hướng A)

```typescript
// server/src/schemas/DATSchema.ts
import { z } from "zod";

export const AddDATSchema = z.object({
  enrollmentId: z.string().min(1, "enrollmentId is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date format: YYYY-MM-DD"),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "Time format: HH:mm"),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, "Time format: HH:mm"),
});

export type AddDATInput = z.infer<typeof AddDATSchema>;
```

### 4.3 Controller

```typescript
// server/src/controllers/DATController.ts
async addDAT(req: Request, res: Response) {
  const parseResult = AddDATSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parseResult.error.flatten(),
    });
  }

  const { enrollmentId, date, timeStart, timeEnd } = parseResult.data;
  const service = new DATService();
  const result = await service.addSession({
    enrollmentId,
    date,
    timeStart,
    timeEnd,
  });

  return res.status(201).json(result);
}
```

---

## 5. Thay Đổi Frontend

### 5.1 Files cần sửa

| File | Thay đổi |
|------|----------|
| `client/src/pages/StudentDetail/` hoặc `components/DATForm.tsx` | Sửa form logic auto-calculation |
| `client/src/services/datApi.ts` hoặc `api/dat.ts` | Sửa payload mapping |
| `client/src/types/dat.types.ts` | Cập nhật interface |

### 5.2 FE Payload Mapping (Hướng A)

```typescript
// client/src/services/datApi.ts
import type { DATFormValues } from "../types/dat.types";

interface BEAddDATResponse { /* ... */ }

export async function addDAT(values: DATFormValues): Promise<BEAddDATResponse> {
  // Map FE fields → BE fields
  const payload = {
    enrollmentId: values.course_student_id, // FE giữ nguyên internal model
    date: values.start_date,                 // YYYY-MM-DD
    timeStart: values.start_time,            // HH:mm
    timeEnd: values.end_time,                // HH:mm
  };

  return api.post("/dat/sessions", payload);
}
```

### 5.3 Form Auto-Calculation (React)

```typescript
// Inside DATForm component
const [form, setForm] = useState({
  start_time: "08:00",
  end_time: "09:00",
  duration: 60, // phút
});

// Handler khi user đổi start_time hoặc end_time → tính duration
const handleTimeChange = (field: "start_time" | "end_time", value: string) => {
  const otherField = field === "start_time" ? "end_time" : "start_time";
  const current = field === "start_time" ? value : form.start_time;
  const other = field === "start_time" ? form.end_time : value;

  const [h1, m1] = current.split(":").map(Number);
  const [h2, m2] = other.split(":").map(Number);
  const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);

  if (totalMinutes >= 0) {
    setForm(prev => ({
      ...prev,
      [field]: value,
      duration: totalMinutes,
    }));
  }
};

// Handler khi user đổi duration → tính end_time
const handleDurationChange = (minutes: number) => {
  const [h, m] = form.start_time.split(":").map(Number);
  const startMinutes = h * 60 + m;
  const endMinutes = startMinutes + minutes;
  const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
  const endM = String(endMinutes % 60).padStart(2, "0");

  setForm(prev => ({
    ...prev,
    duration: minutes,
    end_time: `${endH}:${endM}`,
  }));
};
```

---

## 6. Acceptance Criteria

- [ ] **BE:** `POST /dat/sessions` chấp nhận payload `{ enrollmentId, date, timeStart, timeEnd }` và trả về `201 Created`
- [ ] **BE:** Zod validation trả lỗi rõ ràng khi thiếu field, không crash
- [ ] **FE:** Khi nhập duration → end_time tự cập nhật
- [ ] **FE:** Khi đổi start_time hoặc end_time → duration tự cập nhật
- [ ] **FE:** Thêm DAT thành công từ student detail panel
- [ ] **FE:** Thêm DAT thành công từ trang tiến độ DAT
- [ ] Validation: `start_time` < `end_time`, `duration` ≥ 0
- [ ] Viết unit test cho BE `DATService.addSession()`
- [ ] Viết unit test cho form handlers (start_time, end_time, duration)

---

## 7. Không Làm (Scope Boundary)

- ❌ Không thay đổi schema database (bảng DAT) — chỉ điều chỉnh API layer
- ❌ Không thêm trường mới (session_type, distance_km, notes) trừ khi BE confirm cần
- ❌ Không refactor form UI — chỉ sửa logic calculation, không đổi layout
- ❌ Không sửa flow chỉnh sửa (edit) DAT — chỉ fix flow thêm mới (add)

---

## 8. Test Scenarios

| # | Hành động | Kết quả mong đợi |
|---|-----------|-----------------|
| 1 | Gửi payload đúng với Hướng A | `201`, record được tạo |
| 2 | Gửi thiếu `enrollmentId` | `400` với Zod error chi tiết |
| 3 | Nhập duration = 90 phút | `end_time` = `start_time` + 90 phút |
| 4 | Đổi `start_time` | `duration` tự cập nhật |
| 5 | Đổi `end_time` | `duration` tự cập nhật |
| 6 | Đặt `start_time` > `end_time` | Form show validation error |
| 7 | Thêm từ student detail panel | Toast success, danh sách cập nhật |
| 8 | Thêm từ trang tiến độ DAT | Toast success, danh sách cập nhật |
