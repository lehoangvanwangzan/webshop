import { ValueTransformer } from 'typeorm';

/**
 * MySQL trả cột DECIMAL về dạng string ("3120000.00") để tránh mất độ chính xác.
 * Giá tiền VND nằm trong giới hạn an toàn của number, nên chuyển về number
 * để API trả ra đúng kiểu mà frontend khai báo.
 */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value == null ? value : Number(value)),
};
