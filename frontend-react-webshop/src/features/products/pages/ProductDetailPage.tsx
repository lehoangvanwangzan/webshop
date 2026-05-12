import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  ArrowLeftRight, 
  Plus, 
  Minus, 
  Check,
  ChevronRight,
  CreditCard,
  HeadphonesIcon,
  PackageCheck,
  FileDown,
  ChevronDown,
  Loader2,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { productsApi, resolveProductImageUrl } from '../api/products.api';
import { ROUTES } from '@/routes/routes';
import { Button, message, Skeleton } from 'antd';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const swiperRef = React.useRef<any>(null);

  // Fetch Product Data
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.findOne(productId),
    enabled: !!productId,
  });

  // Fetch Related Products (Mocked for now or could use findAll)
  const { data: relatedProductsData } = useQuery({
    queryKey: ['related-products', product?.category_id],
    queryFn: () => productsApi.findAll({ category_id: product?.category_id, limit: 4 }),
    enabled: !!product?.category_id,
  });

  const relatedProducts = relatedProductsData?.items.filter(p => p.id !== productId) || [];

  // State
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleAddToCart = () => {
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
          <Link to={ROUTES.HOME}>
            <Button type="primary" size="large" className="w-full h-12 rounded-xl">
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [{ id: 0, image_url: '/placeholder.png' }];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <ul className="flex items-center gap-2 flex-wrap">
          <li><Link to={ROUTES.HOME} className="hover:text-blue-600 transition-colors">Trang chủ</Link></li> 
          <ChevronRight size={14} />
          {product.category && (
            <>
              <li><Link to={`${ROUTES.PRODUCTS}?category_id=${product.category_id}`} className="hover:text-blue-600 transition-colors">{product.category.name}</Link></li>
              <ChevronRight size={14} />
            </>
          )}
          <li className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-none">{product.name}</li>
        </ul>
      </nav>

      <main className="container mx-auto px-4 pb-12">
        {/* TOP SECTION: Gallery + Info + Policy */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-4 md:p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Gallery (5/12) */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group border border-gray-100 shadow-inner">
                <Swiper
                  modules={[Autoplay, Navigation, SwiperPagination]}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  loop={productImages.length > 1}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  className="w-full h-full"
                >
                  {productImages.map((img) => (
                    <SwiperSlide key={img.id}>
                      <img 
                        src={resolveProductImageUrl(img.image_url)} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={20} />
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRight size={20} />
                </button>

                <button 
                  onClick={() => setIsWishlist(!isWishlist)} 
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-20"
                >
                  <Heart size={24} className={isWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images?.map((img, idx) => {
                  const url = resolveProductImageUrl(img.image_url);
                  return (
                    <button 
                      key={img.id} 
                      onClick={() => swiperRef.current?.slideToLoop(idx)} 
                      className={`w-20 h-20 rounded-lg border-2 transition-all flex-shrink-0 overflow-hidden ${activeIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Info (4/12) */}
            <div className="md:col-span-4 flex flex-col">
              {product.brand && (
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{product.brand.name}</span>
              )}
              <h1 className="text-2xl font-bold mt-2 leading-tight text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current" />)}
                </div>
                <span className="text-xs text-gray-500">(128 Đánh giá)</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-500">Đã bán 1.5k+</span>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-red-600">
                    {formatPrice(product.discount_price || product.price)}
                  </span>
                  {product.discount_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  {product.discount_price && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                      -{Math.round((1 - product.discount_price / product.price) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase">Số lượng:</h3>
                  <div className="flex items-center border border-gray-200 rounded-lg w-fit bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity-1))} 
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 font-bold text-sm min-w-[50px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity+1)} 
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">Còn {product.stock} sản phẩm trong kho</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart size={18} /> Thêm vào giỏ
                </button>
                <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all uppercase text-sm tracking-wide shadow-lg shadow-blue-200 active:scale-[0.98]">
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Policy Sidebar (3/12) */}
            <div className="md:col-span-3">
              <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2 text-sm">
                  <ShieldCheck size={18} className="text-blue-600" />
                  Chính sách bán hàng
                </h3>
                {[
                  {icon: <PackageCheck size={18}/>, title: "Chính hãng", desc: "Đảm bảo 100% hàng thật", color: "text-blue-600"},
                  {icon: <Truck size={18}/>, title: "Giao nhanh", desc: "Miễn phí đơn từ 2 triệu", color: "text-green-600"},
                  {icon: <ArrowLeftRight size={18}/>, title: "Đổi trả", desc: "7 ngày lỗi nhà sản xuất", color: "text-orange-600"},
                  {icon: <CreditCard size={18}/>, title: "Trả góp", desc: "Hỗ trợ 0% qua thẻ tín dụng", color: "text-purple-600"}
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className={`flex-shrink-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 rounded-2xl border border-dashed border-gray-200 bg-white">
                <p className="text-[10px] text-gray-400 text-center">Giao hàng đến: <span className="font-bold text-gray-700">Hà Nội, Việt Nam</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Description/Reviews (3/4) vs Specs (1/4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column (9/12 = 3/4) */}
          <div className="md:col-span-9 space-y-8">
            {/* Description Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Mô tả sản phẩm</h2>
                <div className="h-1 w-16 bg-blue-600 mt-2 rounded-full"></div>
              </div>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                {product.short_description && (
                  <p className="italic mb-6 font-medium text-gray-800 border-l-4 border-blue-200 pl-4 py-1">
                    {product.short_description}
                  </p>
                )}
                
                <div 
                  className="rich-text-content" 
                  dangerouslySetInnerHTML={{ __html: product.description || '<p>Đang cập nhật nội dung...</p>' }} 
                />

                {!product.description && (
                   <div className="space-y-4">
                      <div className="relative rounded-xl overflow-hidden mb-8 border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop" alt="Feature" className="w-full h-auto" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div className="text-white">
                            <h3 className="font-bold text-lg">Hiệu năng vượt trội</h3>
                            <p className="text-sm opacity-90">Thiết kế hiện đại, công nghệ tiên tiến nhất.</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                          <div className="bg-blue-600 text-white p-2 rounded-lg"><HeadphonesIcon size={20}/></div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">Chất lượng đỉnh cao</h4>
                            <p className="text-xs mt-1">Sản phẩm được gia công tỉ mỉ, độ bền vượt thời gian.</p>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                          <div className="bg-blue-600 text-white p-2 rounded-lg"><Check size={20}/></div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">Đã qua kiểm định</h4>
                            <p className="text-xs mt-1">100% sản phẩm đạt tiêu chuẩn chất lượng quốc tế.</p>
                          </div>
                        </div>
                      </div>
                   </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Đánh giá khách hàng</h2>
                <button className="text-blue-600 text-sm font-bold border border-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-all">Viết đánh giá</button>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-6 rounded-xl mb-8">
                <div className="text-center px-6 md:border-r border-gray-200">
                  <div className="text-5xl font-black text-gray-900">4.8</div>
                  <div className="flex text-yellow-400 my-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-current" />)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">128 Đánh giá</div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-3 font-bold">{star}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{width: star === 5 ? '80%' : star === 4 ? '15%' : '2%'}}></div>
                      </div>
                      <span className="text-gray-400 w-8">{star === 5 ? '80%' : star === 4 ? '15%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">NH</div>
                    <div>
                      <div className="font-bold text-sm">Nguyễn Hải</div>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-current"/>)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"Sản phẩm rất tốt, đóng gói kỹ càng, giao hàng cực nhanh. Rất đáng tiền!"</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (3/12 = 1/4) */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm sticky top-8 border border-gray-100">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900 uppercase">Thông số kỹ thuật</h2>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="p-3 text-[10px] uppercase font-bold text-gray-400 bg-gray-50/30">Thông tin cơ bản</div>
                <div className="flex justify-between p-4 gap-4 transition-colors hover:bg-blue-50/30">
                  <span className="text-xs font-bold text-gray-500 w-1/2">Mã sản phẩm</span>
                  <span className="text-xs font-medium text-gray-800 text-right w-1/2">{product.sku}</span>
                </div>
                <div className="flex justify-between p-4 gap-4 transition-colors hover:bg-blue-50/30">
                  <span className="text-xs font-bold text-gray-500 w-1/2">Thương hiệu</span>
                  <span className="text-xs font-medium text-gray-800 text-right w-1/2">{product.brand?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-4 gap-4 transition-colors hover:bg-blue-50/30">
                  <span className="text-xs font-bold text-gray-500 w-1/2">Danh mục</span>
                  <span className="text-xs font-medium text-gray-800 text-right w-1/2">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-4 gap-4 transition-colors hover:bg-blue-50/30">
                  <span className="text-xs font-bold text-gray-500 w-1/2">Tình trạng</span>
                  <span className="text-xs font-medium text-green-600 text-right w-1/2">{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors py-2 group">
                  <FileDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  <span>Tải Datasheet (PDF)</span>
                </button>
                <button className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                  Tất cả thông số <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
              <Link to={`${ROUTES.PRODUCTS}?category_id=${product.category_id}`} className="text-blue-600 font-bold text-sm hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => {
                 const imgUrl = p.images?.[0]?.image_url
                    ? resolveProductImageUrl(p.images[0].image_url)
                    : '/placeholder.png';
                 return (
                  <Link key={p.id} to={ROUTES.PRODUCT_DETAIL.replace(':id', p.id.toString())} className="group">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-50">
                        <img 
                          src={imgUrl} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 h-10 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-red-600 font-black text-base">{formatPrice(p.discount_price || p.price)}</div>
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ShoppingCart size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                 );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
