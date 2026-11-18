export interface ContactForm {
  phone: string;
  address: string;
  recipientName: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactForm, string>>;

export const EMPTY_CONTACT_FORM: ContactForm = { phone: "", address: "", recipientName: "" };

export const CONTACT_FIELD_MAX_LENGTH: Record<keyof ContactForm, number> = {
  phone: 20,
  address: 300,
  recipientName: 100,
};

// Cột contactInfo trong database giới hạn 500 ký tự
const CONTACT_INFO_MAX_LENGTH = 500;
const MIN_ADDRESS_LENGTH = 10;
const VIETNAM_PHONE_PATTERN = /^(?:0|\+?84)\d{9,10}$/;

function normalizePhone(phone: string): string {
  return phone.replace(/[\s.-]/g, "");
}

/** Ghép các ô thành chuỗi JSON để gửi vào trường contactInfo */
export function serializeContactInfo(form: ContactForm): string {
  return JSON.stringify({
    phone: normalizePhone(form.phone),
    address: form.address.trim(),
    recipientName: form.recipientName.trim(),
  });
}

export function validateContactForm(form: ContactForm): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const phone = normalizePhone(form.phone);
  const address = form.address.trim();

  if (!phone) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!VIETNAM_PHONE_PATTERN.test(phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  if (!address) {
    errors.address = "Vui lòng nhập địa chỉ nhận hàng";
  } else if (address.length < MIN_ADDRESS_LENGTH) {
    errors.address = "Vui lòng ghi rõ số nhà, đường, phường/xã, tỉnh/thành phố";
  } else if (serializeContactInfo(form).length > CONTACT_INFO_MAX_LENGTH) {
    errors.address = "Địa chỉ quá dài, vui lòng rút gọn";
  }

  if (!form.recipientName.trim()) {
    errors.recipientName = "Vui lòng nhập tên người nhận";
  }

  return errors;
}

function parseContactInfo(contactInfo: string): ContactForm | null {
  try {
    const parsed: unknown = JSON.parse(contactInfo);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { phone, address, recipientName } = parsed as Record<string, unknown>;
    if (typeof phone !== "string" || typeof address !== "string" || typeof recipientName !== "string") {
      return null;
    }
    return { phone, address, recipientName };
  } catch {
    return null;
  }
}

/** Chuỗi để hiển thị, mỗi thông tin một dòng. Đơn cũ dạng chữ thường giữ nguyên. */
export function formatContactInfo(contactInfo: string): string {
  const contact = parseContactInfo(contactInfo);
  if (!contact) return contactInfo;
  return [
    `Người nhận: ${contact.recipientName}`,
    `SĐT: ${contact.phone}`,
    `Địa chỉ: ${contact.address}`,
  ].join("\n");
}
