import ImagePicker from 'react-native-image-crop-picker';

import { API_ENDPOINT_SEARCH, TEST_EMAIL, CROP_WIDTH, CROP_HEIGHT } from '../config/constants';

const photoOptions = {
  cropping: true,
  width: CROP_WIDTH,
  height: CROP_HEIGHT,
  cropperToolbarTitle: 'Crop Photo',
  includeBase64: true,
  mediaType: 'photo',
};

function uploadPhoto(photo) {
  this.props.navigation.navigate('Buffer', { photo });

   return fetch(API_ENDPOINT_SEARCH, {
     method: 'POST',
     body: JSON.stringify({
         email: TEST_EMAIL,
         image: photo.data, // base64 representation
     }),
     headers: {
       'Content-Type': 'application/json',
     }
   })
     .then((res) => {
       return res.json();
     })
     .then((data) => {
        return data.items;
      })
     // navigate to RecommendationsScreen
     .then((recomm) => {
        this.props.navigation.navigate('Recommendations', { recomm });
      })
     .catch(e => console.error(e));
}

export function selectPhotoFromGallery() {
  return ImagePicker.openPicker(photoOptions)
    .then(photo => uploadPhoto.call(this, photo))
    .catch(() => {});
}

export function takePhotoWithCamera() {
  return ImagePicker.openCamera(photoOptions)
    .then(photo => uploadPhoto.call(this, photo))
    .catch(() => {});
}
