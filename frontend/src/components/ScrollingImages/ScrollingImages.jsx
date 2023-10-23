import { useEffect, useState, useRef } from 'react';
import { GetImages } from '../../api/UserRoutes';


const ScrollingImages = () => {
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);


  useEffect(() => {
    const loadInitialImages = async () => {
      const response = await GetImages(20);
      setImages(response);
    };

    if (images.length === 0) {
      loadInitialImages();
    }
  }, [images]);


  return (
    <div ref={containerRef} className="fixed h-screen w-screen">
      <div className="scroll-images fixed w-screen h-screen flex flex-wrap gap-5 flex-row z-0 items-center justify-center">
        {images.map((image, index) => (
          <div key={index} className="scroll-image">
            <img
                className='w-[45vw] md:w-[30vw] blur-md md:blur-lg'
                src={`data:image/jpeg;base64,${image["image_base64"]}`}
                alt={`Image ${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingImages;


