import type { ComponentType } from 'react';
import {
  WifiOutlined,
  ApiOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  HddOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

export const SLUG_ICON: Record<string, ComponentType> = {
  'bo-phat-wifi':                WifiOutlined,
  'thiet-bi-can-bang-tai':       ApiOutlined,
  'bo-chuyen-mach-switch':       ApartmentOutlined,
  'thiet-bi-tuong-lua-firewall': SafetyOutlined,
  'thiet-bi-luu-tru':            DatabaseOutlined,
  'o-cung-cho-server-nas':       HddOutlined,
  'may-chu-server':              CloudServerOutlined,
  'thiet-bi-mang-cong-nghiep':   ClusterOutlined,
  'thiet-bi-dien-nhe':           ThunderboltOutlined,
  'phu-kien-khac':               AppstoreOutlined,
};
