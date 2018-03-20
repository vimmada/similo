import { AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { API_ENDPOINT_AUTH, API_ENDPOINT_SEARCH, TEST_EMAIL, CROP_WIDTH, CROP_HEIGHT } from '../config/constants';

const photoOptions = {
  cropping: true,
  width: CROP_WIDTH,
  height: CROP_HEIGHT,
  cropperToolbarTitle: 'Crop Photo',
  includeBase64: true,
  mediaType: 'photo',
};

async function uploadPhoto(photo) {
  this.props.navigation.navigate('Buffer', { photo });

userToken = await AsyncStorage.getItem('userToken');
   return fetch(API_ENDPOINT_SEARCH, {
     method: 'POST',
     body: JSON.stringify({
         email: TEST_EMAIL,
         image: photo.data, // base64 representation
     }),
     header: {
       'Authorization': userToken,
       'Content-Type': 'application/json',
     }
   })
     .then(res => res.json())
     .then((data) => {
        return data.items;
      })
     // navigate to RecommendationsScreen
     .then((recomm) => {
        this.props.navigation.navigate('Recommendations', { data : recomm });
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

export async function login(username, password) {
  userToken = await AsyncStorage.getItem('userToken');

  return fetch(API_ENDPOINT_AUTH, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      'Authorization': userToken,
      'Content-Type': 'application/json',
    }
  });
}

export async function logout() {
  await AsyncStorage.clear();
  this.props.navigation.navigate('Auth');
}
