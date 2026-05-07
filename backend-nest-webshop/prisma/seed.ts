import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const gLogo = (domain: string) =>
  `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;

// ─── BRANDS ───────────────────────────────────────────────────────────────────

const brands = [
  { name: 'Ubiquiti',         slug: 'ubiquiti',         sort_order: 1,  website_url: 'https://www.ui.com',               logo_url: gLogo('ui.com') },
  { name: 'MikroTik',         slug: 'mikrotik',         sort_order: 2,  website_url: 'https://mikrotik.com',             logo_url: gLogo('mikrotik.com') },
  { name: 'LigoWave',         slug: 'ligowave',         sort_order: 3,  website_url: 'https://www.ligowave.com',         logo_url: gLogo('ligowave.com') },
  { name: 'Teltonika',        slug: 'teltonika',        sort_order: 4,  website_url: 'https://teltonika-networks.com',   logo_url: gLogo('teltonika-networks.com') },
  { name: 'Ruckus',           slug: 'ruckus',           sort_order: 5,  website_url: 'https://www.ruckusnetworks.com',   logo_url: gLogo('ruckusnetworks.com') },
  { name: 'UniFi',            slug: 'unifi',            sort_order: 6,  website_url: 'https://www.ui.com/wi-fi',         logo_url: gLogo('ui.com') },
  { name: 'Meraki',           slug: 'meraki',           sort_order: 7,  website_url: 'https://meraki.cisco.com',         logo_url: gLogo('meraki.com') },
  { name: 'Synology',         slug: 'synology',         sort_order: 8,  website_url: 'https://www.synology.com',         logo_url: gLogo('synology.com') },
  { name: 'QNAP',             slug: 'qnap',             sort_order: 9,  website_url: 'https://www.qnap.com',             logo_url: gLogo('qnap.com') },
  { name: 'Seagate',          slug: 'seagate',          sort_order: 10, website_url: 'https://www.seagate.com',          logo_url: gLogo('seagate.com') },
  { name: 'Fortinet',         slug: 'fortinet',         sort_order: 11, website_url: 'https://www.fortinet.com',         logo_url: gLogo('fortinet.com') },
  { name: 'Netgate',          slug: 'netgate',          sort_order: 12, website_url: 'https://www.netgate.com',          logo_url: gLogo('netgate.com') },
  { name: 'Draytek',          slug: 'draytek',          sort_order: 13, website_url: 'https://www.draytek.com',          logo_url: gLogo('draytek.com') },
  { name: 'SonicWall',        slug: 'sonicwall',        sort_order: 14, website_url: 'https://www.sonicwall.com',        logo_url: gLogo('sonicwall.com') },
  { name: 'Sophos',           slug: 'sophos',           sort_order: 15, website_url: 'https://www.sophos.com',           logo_url: gLogo('sophos.com') },
  { name: 'Western Digital',  slug: 'western-digital',  sort_order: 16, website_url: 'https://www.westerndigital.com',   logo_url: gLogo('westerndigital.com') },
  { name: 'TerraMaster',      slug: 'terramaster',      sort_order: 17, website_url: 'https://www.terra-master.com',     logo_url: gLogo('terra-master.com') },
  { name: 'Cambium Networks', slug: 'cambium-networks', sort_order: 18, website_url: 'https://www.cambiumnetworks.com',  logo_url: gLogo('cambiumnetworks.com') },
  { name: 'Aruba',            slug: 'aruba',            sort_order: 19, website_url: 'https://www.arubanetworks.com',    logo_url: gLogo('arubanetworks.com') },
  { name: 'Extreme Networks', slug: 'extreme-networks', sort_order: 20, website_url: 'https://www.extremenetworks.com',  logo_url: gLogo('extremenetworks.com') },
  { name: 'EnGenius',         slug: 'engenius',         sort_order: 21, website_url: 'https://www.engeniustech.com',     logo_url: gLogo('engeniustech.com') },
  { name: 'Ruijie',           slug: 'ruijie',           sort_order: 22, website_url: 'https://www.ruijienetworks.com',   logo_url: gLogo('ruijienetworks.com') },
  { name: 'Grandstream',      slug: 'grandstream',      sort_order: 23, website_url: 'https://www.grandstream.com',      logo_url: gLogo('grandstream.com') },
  { name: 'Peplink',          slug: 'peplink',          sort_order: 24, website_url: 'https://www.peplink.com',          logo_url: gLogo('peplink.com') },
  { name: 'Palo Alto',        slug: 'palo-alto',        sort_order: 25, website_url: 'https://www.paloaltonetworks.com', logo_url: gLogo('paloaltonetworks.com') },
  { name: 'Juniper',          slug: 'juniper',          sort_order: 26, website_url: 'https://www.juniper.net',          logo_url: gLogo('juniper.net') },
  { name: 'Kemp',             slug: 'kemp',             sort_order: 27, website_url: 'https://kemptechnologies.com',     logo_url: gLogo('kemptechnologies.com') },
  { name: 'ELTEX',            slug: 'eltex',            sort_order: 28, website_url: 'https://eltex-co.ru',              logo_url: gLogo('eltex-co.ru') },
  { name: 'Cisco',            slug: 'cisco',            sort_order: 29, website_url: 'https://www.cisco.com',            logo_url: gLogo('cisco.com') },
  { name: 'Asustor',          slug: 'asustor',          sort_order: 30, website_url: 'https://www.asustor.com',          logo_url: gLogo('asustor.com') },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const parentCategories = [
  { name: 'Bộ phát Wifi',                 slug: 'bo-phat-wifi',              sort_order: 1  },
  { name: 'Thiết bị cân bằng tải',        slug: 'thiet-bi-can-bang-tai',     sort_order: 2  },
  { name: 'Bộ chuyển mạch Switch',        slug: 'bo-chuyen-mach-switch',     sort_order: 3  },
  { name: 'Thiết bị tường lửa Firewall',  slug: 'thiet-bi-tuong-lua-firewall', sort_order: 4 },
  { name: 'Thiết bị lưu trữ',             slug: 'thiet-bi-luu-tru',          sort_order: 5  },
  { name: 'Ổ cứng cho Server NAS',        slug: 'o-cung-cho-server-nas',     sort_order: 6  },
  { name: 'Máy chủ Server',               slug: 'may-chu-server',            sort_order: 7  },
  { name: 'Thiết bị mạng công nghiệp',    slug: 'thiet-bi-mang-cong-nghiep', sort_order: 8  },
  { name: 'Thiết bị điện nhẹ',            slug: 'thiet-bi-dien-nhe',         sort_order: 9  },
  { name: 'Phụ kiện khác',                slug: 'phu-kien-khac',             sort_order: 10 },
];

const CB = gLogo;

const childCategories: Record<string, { name: string; slug: string; image_url?: string }[]> = {
  'bo-phat-wifi': [
    { name: 'Wifi Ubiquiti',    slug: 'bo-phat-wifi-ubiquiti',    image_url: CB('ui.com')                },
    { name: 'Wifi UniFi',       slug: 'bo-phat-wifi-unifi',       image_url: CB('ui.com')                },
    { name: 'Wifi Ruckus',      slug: 'bo-phat-wifi-ruckus',      image_url: CB('ruckusnetworks.com')    },
    { name: 'Wifi Huawei',      slug: 'bo-phat-wifi-huawei',      image_url: CB('huawei.com')            },
    { name: 'Wifi Meraki',      slug: 'bo-phat-wifi-meraki',      image_url: CB('meraki.com')            },
    { name: 'Wifi Aruba',       slug: 'bo-phat-wifi-aruba',       image_url: CB('arubanetworks.com')     },
    { name: 'Wifi Grandstream', slug: 'bo-phat-wifi-grandstream', image_url: CB('grandstream.com')       },
    { name: 'Wifi Ruijie',      slug: 'bo-phat-wifi-ruijie',      image_url: CB('ruijienetworks.com')    },
    { name: 'Wifi Extreme',     slug: 'bo-phat-wifi-extreme',     image_url: CB('extremenetworks.com')   },
    { name: 'Wifi MikroTik',    slug: 'bo-phat-wifi-mikrotik',    image_url: CB('mikrotik.com')          },
    { name: 'Wifi EnGenius',    slug: 'bo-phat-wifi-engenius',    image_url: CB('engeniustech.com')      },
    { name: 'Wifi Cambium',     slug: 'bo-phat-wifi-cambium',     image_url: CB('cambiumnetworks.com')   },
    { name: 'Wifi LigoWave',    slug: 'bo-phat-wifi-ligowave',    image_url: CB('ligowave.com')          },
    { name: 'Wifi Fortinet',    slug: 'bo-phat-wifi-fortinet',    image_url: CB('fortinet.com')          },
    { name: 'WiFi Everest',     slug: 'bo-phat-wifi-everest'                                             },
    { name: 'WiFi H3C',         slug: 'bo-phat-wifi-h3c',         image_url: CB('h3c.com')               },
  ],
  'thiet-bi-can-bang-tai': [
    { name: 'Router MikroTik',          slug: 'can-bang-tai-mikrotik',  image_url: CB('mikrotik.com')          },
    { name: 'Router Ubiquiti',          slug: 'can-bang-tai-ubiquiti',  image_url: CB('ui.com')                },
    { name: 'Router Draytek',           slug: 'can-bang-tai-draytek',   image_url: CB('draytek.com')           },
    { name: 'Router Teltonika',         slug: 'can-bang-tai-teltonika', image_url: CB('teltonika-networks.com')},
    { name: 'Router Huawei',            slug: 'can-bang-tai-huawei',    image_url: CB('huawei.com')            },
    { name: 'Barracuda Load Balancer',  slug: 'can-bang-tai-barracuda', image_url: CB('barracuda.com')         },
    { name: 'Router Cisco',             slug: 'can-bang-tai-cisco',     image_url: CB('cisco.com')             },
    { name: 'Load Balancing Kemp',      slug: 'can-bang-tai-kemp',      image_url: CB('kemptechnologies.com')  },
    { name: 'Load Balancing Peplink',   slug: 'can-bang-tai-peplink',   image_url: CB('peplink.com')           },
    { name: 'Router H3C',               slug: 'can-bang-tai-h3c',       image_url: CB('h3c.com')               },
    { name: 'Router HPE',               slug: 'can-bang-tai-hpe',       image_url: CB('hpe.com')               },
    { name: 'Load Balancing FortiADC',  slug: 'can-bang-tai-fortiadc',  image_url: CB('fortinet.com')          },
    { name: 'Router Ruijie',            slug: 'can-bang-tai-ruijie',    image_url: CB('ruijienetworks.com')    },
  ],
  'bo-chuyen-mach-switch': [
    { name: 'Switch MikroTik',    slug: 'switch-mikrotik',    image_url: CB('mikrotik.com')        },
    { name: 'Switch Ubiquiti',    slug: 'switch-ubiquiti',    image_url: CB('ui.com')              },
    { name: 'Switch UniFi',       slug: 'switch-unifi',       image_url: CB('ui.com')              },
    { name: 'Switch Ruckus',      slug: 'switch-ruckus',      image_url: CB('ruckusnetworks.com')  },
    { name: 'Switch Huawei',      slug: 'switch-huawei',      image_url: CB('huawei.com')          },
    { name: 'Switch Fortinet',    slug: 'switch-fortinet',    image_url: CB('fortinet.com')        },
    { name: 'Switch Draytek',     slug: 'switch-draytek',     image_url: CB('draytek.com')         },
    { name: 'Switch Cisco',       slug: 'switch-cisco',       image_url: CB('cisco.com')           },
    { name: 'Switch Aruba',       slug: 'switch-aruba',       image_url: CB('arubanetworks.com')   },
    { name: 'Switch Grandstream', slug: 'switch-grandstream', image_url: CB('grandstream.com')     },
    { name: 'Switch Teltonika',   slug: 'switch-teltonika',   image_url: CB('teltonika-networks.com')},
    { name: 'Switch Extreme',     slug: 'switch-extreme',     image_url: CB('extremenetworks.com') },
    { name: 'Switch EnGenius',    slug: 'switch-engenius',    image_url: CB('engeniustech.com')    },
    { name: 'Switch H3C',         slug: 'switch-h3c',         image_url: CB('h3c.com')             },
    { name: 'Switch Ruijie',      slug: 'switch-ruijie',      image_url: CB('ruijienetworks.com')  },
  ],
  'thiet-bi-tuong-lua-firewall': [
    { name: 'Firewall Fortigate',    slug: 'firewall-fortigate',  image_url: CB('fortinet.com')          },
    { name: 'Firewall Barracuda',    slug: 'firewall-barracuda',  image_url: CB('barracuda.com')         },
    { name: 'Firewall Netgate',      slug: 'firewall-netgate',    image_url: CB('netgate.com')           },
    { name: 'Firewall Palo Alto',    slug: 'firewall-palo-alto',  image_url: CB('paloaltonetworks.com')  },
    { name: 'Firewall Huawei',       slug: 'firewall-huawei',     image_url: CB('huawei.com')            },
    { name: 'Firewall Cisco',        slug: 'firewall-cisco',      image_url: CB('cisco.com')             },
    { name: 'Firewall WatchGuard',   slug: 'firewall-watchguard', image_url: CB('watchguard.com')        },
    { name: 'Firewall Sophos',       slug: 'firewall-sophos',     image_url: CB('sophos.com')            },
    { name: 'Firewall SonicWall',    slug: 'firewall-sonicwall',  image_url: CB('sonicwall.com')         },
    { name: 'Firewall H3C',          slug: 'firewall-h3c',        image_url: CB('h3c.com')               },
    { name: 'Firewall FortiNAC',     slug: 'firewall-fortinac',   image_url: CB('fortinet.com')          },
    { name: 'Firewall Fortiweb',     slug: 'firewall-fortiweb',   image_url: CB('fortinet.com')          },
    { name: 'Firewall Zyxel',        slug: 'firewall-zyxel',      image_url: CB('zyxel.com')             },
  ],
  'thiet-bi-luu-tru': [
    { name: 'NAS Synology',            slug: 'luu-tru-nas-synology',    image_url: CB('synology.com')      },
    { name: 'NAS QNAP',                slug: 'luu-tru-nas-qnap',        image_url: CB('qnap.com')          },
    { name: 'NAS TerraMaster',         slug: 'luu-tru-nas-terramaster', image_url: CB('terra-master.com')  },
    { name: 'NAS ASUSTOR',             slug: 'luu-tru-nas-asustor',     image_url: CB('asustor.com')       },
    { name: 'Thiết bị lưu trữ DAS',   slug: 'luu-tru-das'                                                 },
    { name: 'Dell EMC Data Storage',   slug: 'luu-tru-dell-emc',        image_url: CB('dell.com')          },
    { name: 'HPE Storage',             slug: 'luu-tru-hpe',             image_url: CB('hpe.com')           },
  ],
  'o-cung-cho-server-nas': [
    { name: 'Ổ cứng Synology',         slug: 'o-cung-synology',        image_url: CB('synology.com')      },
    { name: 'Ổ cứng Toshiba',          slug: 'o-cung-toshiba',         image_url: CB('toshiba.com')       },
    { name: 'Ổ cứng Seagate',          slug: 'o-cung-seagate',         image_url: CB('seagate.com')       },
    { name: 'SSD Samsung Enterprise',  slug: 'o-cung-ssd-samsung',     image_url: CB('samsung.com')       },
    { name: 'Ổ cứng Western Digital',  slug: 'o-cung-western-digital', image_url: CB('westerndigital.com')},
  ],
  'may-chu-server': [
    { name: 'Server Dell',      slug: 'server-dell',     image_url: CB('dell.com') },
    { name: 'Server HPE',       slug: 'server-hpe',      image_url: CB('hpe.com')  },
    { name: 'RAM Server',       slug: 'server-ram'                                  },
    { name: 'HDD Server',       slug: 'server-hdd'                                  },
    { name: 'Phụ kiện Server',  slug: 'server-phu-kien'                             },
  ],
  'thiet-bi-mang-cong-nghiep': [
    { name: 'Modem Gateway 3G/4G/5G công nghiệp',  slug: 'cong-nghiep-modem-gateway', image_url: CB('teltonika-networks.com') },
    { name: 'Bộ phát wifi công nghiệp',            slug: 'cong-nghiep-bo-phat-wifi',  image_url: CB('teltonika-networks.com') },
    { name: 'Switch công nghiệp',                  slug: 'cong-nghiep-switch'                                                  },
    { name: 'Router 3G/4G/5G công nghiệp',         slug: 'cong-nghiep-router',        image_url: CB('teltonika-networks.com') },
    { name: 'LoRaWan',                             slug: 'cong-nghiep-lorawan'                                                 },
    { name: 'Máy tính công nghiệp',                slug: 'cong-nghiep-may-tinh'                                               },
    { name: 'Firewall công nghiệp',                slug: 'cong-nghiep-firewall'                                               },
  ],
  'thiet-bi-dien-nhe': [
    { name: 'Camera giám sát',             slug: 'dien-nhe-camera'           },
    { name: 'Tổng đài - điện thoại IP',   slug: 'dien-nhe-tong-dai-ip',     image_url: CB('grandstream.com') },
    { name: 'Hệ thống âm thanh',           slug: 'dien-nhe-am-thanh'         },
    { name: 'Hệ thống kiểm soát ra vào',  slug: 'dien-nhe-kiem-soat-ra-vao' },
    { name: 'Hạ tầng cáp mạng',           slug: 'dien-nhe-ha-tang-cap-mang' },
    { name: 'Bộ lưu điện UPS',            slug: 'dien-nhe-ups'               },
    { name: 'Máng cáp',                   slug: 'dien-nhe-mang-cap'          },
    { name: 'Tủ mạng',                    slug: 'dien-nhe-tu-mang'           },
  ],
  'phu-kien-khac': [
    { name: 'RAM & Networking',        slug: 'phu-kien-ram-networking'                                      },
    { name: 'Phụ kiện Teltonika',      slug: 'phu-kien-teltonika',    image_url: CB('teltonika-networks.com')},
    { name: 'License',                 slug: 'phu-kien-license'                                             },
    { name: 'Module & Phụ kiện quang', slug: 'phu-kien-module-quang'                                       },
    { name: 'Adapter & nguồn PoE',     slug: 'phu-kien-adapter-poe'                                        },
  ],
};

// ─── SEED FUNCTIONS ───────────────────────────────────────────────────────────

async function seedBrands(connection: mysql.Connection) {
  console.log('Seeding brands into shop_brand...');
  for (const brand of brands) {
    await connection.execute(
      `INSERT INTO shop_brand (name, slug, logo_url, website_url, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), logo_url = VALUES(logo_url), website_url = VALUES(website_url)`,
      [brand.name, brand.slug, brand.logo_url, brand.website_url, brand.sort_order],
    );
  }
  console.log(`✓ Seeded ${brands.length} brands`);
}

async function seedCategories(connection: mysql.Connection) {
  console.log('Seeding categories into shop_categories...');

  let totalChildren = 0;

  for (const parent of parentCategories) {
    // Insert parent, get id
    await connection.execute(
      `INSERT INTO shop_categories (name, slug, parent_id, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, NULL, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order)`,
      [parent.name, parent.slug, parent.sort_order],
    );

    const [[row]] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT id FROM shop_categories WHERE slug = ?`,
      [parent.slug],
    );
    const parentId = row.id;

    const children = childCategories[parent.slug] ?? [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      await connection.execute(
        `INSERT INTO shop_categories (name, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE name = VALUES(name), parent_id = VALUES(parent_id),
           image_url = VALUES(image_url), sort_order = VALUES(sort_order)`,
        [child.name, child.slug, parentId, child.image_url ?? null, i + 1],
      );
    }
    totalChildren += children.length;
    console.log(`  ✓ ${parent.name} (${children.length} subcategories)`);
  }

  console.log(`✓ Seeded ${parentCategories.length} parent categories + ${totalChildren} subcategories`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);

  await seedBrands(connection);
  await seedCategories(connection);

  await connection.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
