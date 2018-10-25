import React, { Component, State } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

// type Position = { lat: number, lng: number }
// 
// type State = {
//   center: Position,
//   marker: Position,
//   zoom: number,
//   draggable: boolean,

export default class SimpleMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 51.505,
        lng: -0.09,
      },
      marker: {
        lat: 51.505,
        lng: -0.09,
      },
      zoom: 13,
      draggable: true,
    }
    this.refmarker = React.createRef()
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  updatePosition = () => {
    const marker = this.refmarker.current
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng(),
      })
    }
  }

  render() {
    const position = [this.state.center.lat, this.state.center.lng]
    const markerPosition = [this.state.marker.lat, this.state.marker.lng]

    return (
      <Map center={position} zoom={this.state.zoom} className="lfMap">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={this.state.draggable}
          onDragend={this.updatePosition}
          position={markerPosition}
          ref={this.refmarker}>
          <Popup minWidth={90}>
            <span onClick={this.toggleDraggable}>
              {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
            </span>
          </Popup>
        </Marker>
      </Map>
    )
  }
}