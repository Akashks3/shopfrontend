import React from 'react'
import "./LandingPage.css"

import SimpleImageSlider from "react-simple-image-slider";

export default function LandingPage() {

  const images = [
    { url: "https://cottonworld.net/cdn/shop/files/bestseller_and_new_arrivals_banner_mobile_banner-04_bab8d8e5-3f8f-4477-9d12-92a59bc77eaa.jpg?v=1732632514&width=1280" },
    { url: "https://media.istockphoto.com/id/1293366109/photo/this-one-match-perfect-with-me.jpg?s=612x612&w=0&k=20&c=wJ6yYbRrDfdmoViuQkX39s2z_0lCiNQYgEtLU--0EbY=" },
    { url: "https://media.gq.com/photos/6792aea9cfa4b2887e61dce1/master/w_2560%2Cc_limit/menswear-basics.jpg" },
    { url: "https://www.lalgate.in/wp-content/uploads/2024/08/mens-casual-wear.jpg" },

  ];
 
  return (
    <div className='LandingPage'>
      <div>
        <SimpleImageSlider
          width={"100%"}
          height={400}
          images={images}
          showBullets={false}
          showNavs={false}
          autoPlay={true}
        />
      </div>

    </div>
  )
}
