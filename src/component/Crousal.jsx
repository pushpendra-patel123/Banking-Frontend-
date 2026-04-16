// components/Carousel.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const Carousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );
        if (res.data.success) {
          setBanners(res.data.data.banners);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[158px] md:h-[400px] bg-gray-100 animate-pulse" />
    );
  }

  if (!banners.length) return null;

  return (
    <div className="w-full h-[158px] md:h-[400px]">
      <Slider {...settings}>
        {banners.map((item, index) => (
          <div key={index}>
            <img
              src={item.imageUrl}
              alt={`Banner ${index + 1}`}
              className="w-full h-[158px] md:h-[400px] object-cover object-center"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;