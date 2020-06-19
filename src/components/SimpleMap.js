import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON, Marker } from 'react-leaflet';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import L from 'leaflet';
export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 48.42,
        lng: 9.98
      },
      zoom: 13,
      spots: null,
      selectedFeature: {
        properties: {
          NAME: 'the name'
        }
      },
      detailDialogOpen: false
    };
    this.refmarker = React.createRef();

    this.handleClose = this.handleClose.bind(this);
    this.handleMoveend = this.handleMoveend.bind(this);
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable });
  };

  componentDidMount() {
    fetch('http://localhost:3000/spots/42/9/5', {
      mode: 'cors'
    })
      .then(result => result.json())
      .then(val => {
        console.log(val);
        this.setState({ spots: val });
      });
  }

  updatePosition = () => {
    const marker = this.refmarker.current;
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng()
      });
    }
  };

  getStyle(feature, layer) {
    return {
      color: '#006400',
      weight: 5,
      opacity: 0.65
    };
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  }

  handleMoveend() {
    var bounds = this.refs.map.leafletElement.getBounds();
    var tl = bounds.getNorthWest();
    var br = bounds.getSouthEast();
    fetch('http://localhost:3000/spots/' + tl.lng + '/' + tl.lat + '/' + br.lng + '/' + br.lat, {
      mode: 'cors'
    })
      .then(result => result.json())
      .then(val => {
        console.log(val);
        this.setState({ spots: val });
      });
  }
  clickToFeature(e) {
    var layer = e.target;
    console.log('I clicked on ', layer.feature);
    this.setState({
      selectedFeature: layer.feature,
      detailDialogOpen: true
    });
  }

  handleClose() {
    this.setState({ detailDialogOpen: false });
  }

  render() {
    const dialog = (
      <Dialog
        open={this.state.detailDialogOpen}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {this.state.selectedFeature.properties.NAME}
        </DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );

    const position = [this.state.center.lat, this.state.center.lng];
    var spots = this.state.spots ? this.state.spots : [];

    function getIcon(spot) {
      return L.icon({
        iconUrl: "https://www.park4night.com/www/resources/images/pins/poi_" + spot.code.toLowerCase() + ".png", iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
      });
    }
    return (
      <div>
        <Map ref="map" center={position} zoom={this.state.zoom} onMoveend={this.handleMoveend} className="lfMap" >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {spots.map(spot => (
            <Marker
              key={spot.id}
              icon={getIcon(spot)}
              position={[
                spot.location.coordinates[1],
                spot.location.coordinates[0],
              ]}
              onClick={() => {
                console.log(spot);
              }}
            />
          ))}
        </Map>
      </div>
    );
  }
}
