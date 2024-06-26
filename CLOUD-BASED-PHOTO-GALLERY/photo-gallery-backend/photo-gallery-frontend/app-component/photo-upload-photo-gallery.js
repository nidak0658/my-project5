import React from 'react';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';

const App = () => {
  return (
    <div>
      <h1>Photo Gallery</h1>
      <PhotoUpload />
      <PhotoGallery />
    </div>
  );
};

export default App;
