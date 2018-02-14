import React, { Component } from 'react';

import FullScreenPhoto from '../components/FullScreenPhoto';

export default class ConfirmScreen extends Component {
  constructor(props) {
    super(props);

    this.uploadPhoto = this.uploadPhoto.bind(this);

    this.props.navigation.setParams({ uploadPhoto: this.uploadPhoto });
  }

  uploadPhoto() {
    const { photo } = this.props.navigation.state.params;

    this.props.navigation.navigate('Buffer', { photo });
  }

  render() {
    const { photo } = this.props.navigation.state.params;

    return (
      <FullScreenPhoto photo={photo} />
    );
  }
}
