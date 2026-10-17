/* =========================================================
   داده‌های گالری

   فایل‌ها را اینجا بگذار:
     public/pic-gallery/images/   ← عکس‌ها (jpg / png / webp)
     public/pic-gallery/videos/   ← ویدیوها (mp4 با H.264 بهترین سازگاری را دارد)

   برای اضافه کردن آیتم جدید فقط یک خط به آرایه‌ی پایین اضافه کن.
   poster برای ویدیو اختیاری است (عکس پیش‌نمایش)؛ اگر نگذاری
   خود مرورگر یک فریم از ویدیو را نشان می‌دهد.
========================================================= */

export type GalleryItem = {
    id: string;
    type: "image" | "video";
    src: string;
    poster?: string;
    title: string;
    caption?: string;
  };
  
  const IMG = "/pic-gallery/images";
  const VID = "/pic-gallery/videos";
  
  export const galleryItems: GalleryItem[] = [
    // ---------- عکس‌ها ----------
    { id: "img-01", type: "image", src: `${IMG}/photo-01.jpg`, title: "عکس اول", caption: "توضیح کوتاه عکس اول" },
    { id: "img-02", type: "image", src: `${IMG}/photo-02.jpg`, title: "عکس دوم" },
    { id: "img-03", type: "image", src: `${IMG}/photo-03.jpg`, title: "عکس سوم" },
    { id: "img-04", type: "image", src: `${IMG}/photo-04.jpg`, title: "عکس چهارم" },
    { id: "img-05", type: "image", src: `${IMG}/photo-05.jpg`, title: "عکس پنجم" },
    { id: "img-06", type: "image", src: `${IMG}/photo-06.jpg`, title: "عکس ششم" },
    { id: "img-07", type: "image", src: `${IMG}/photo-07.jpg`, title: "عکس هفتم" },
    { id: "img-08", type: "image", src: `${IMG}/photo-08.jpg`, title: "عکس هشتم" },
  
    // ---------- ویدیوها ----------
    { id: "vid-01", type: "video", src: `${VID}/video-01.mp4`, title: "ویدیو اول", caption: "توضیح کوتاه ویدیو اول" },
    { id: "vid-02", type: "video", src: `${VID}/video-02.mp4`, title: "ویدیو دوم" },
    { id: "vid-03", type: "video", src: `${VID}/video-03.mp4`, title: "ویدیو سوم" },
  ];