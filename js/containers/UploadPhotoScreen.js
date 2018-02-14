import { View } from 'react-native';
import React, { Component } from 'react';
import CameraRollPicker from 'react-native-camera-roll-picker';

export default class UploadPhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { photo: null };

    this.onPhotoSelected = this.onPhotoSelected.bind(this);
    this.navigateToConfirm = this.navigateToConfirm.bind(this);

    this.props.navigation.setParams({ navigateToConfirm: this.navigateToConfirm });
  }

  onPhotoSelected(selected) {
    this.setState({ photo: selected.length ? selected[0] : null });
  }

  navigateToConfirm() {
    if (!this.state.photo) return;

    this.props.navigation.navigate('Confirm', { photo: this.state.photo });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CameraRollPicker
          maximum={1}
          callback={this.onPhotoSelected}
        />
      </View>
    );
  }
}
