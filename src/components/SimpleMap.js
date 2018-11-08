import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 48.42,
        lng: 9.98
      },
      zoom: 13,
      geoJson: null,
      selectedFeature: {
        properties: {
          NAME: 'the name'
        }
      },
      detailDialogOpen: false
    };
    this.refmarker = React.createRef();

    this.handleClose = this.handleClose.bind(this);
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable });
  };

  componentDidMount() {
    fetch('/locpic-react/waters.geojson', {
      mode: 'cors'
    })
      .then(result => result.json())
      .then(val => {
        console.log(val);
        this.setState({ geoJson: val });
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

  renderMap() {
    return (
      <GeoJSON
        data={this.state.geoJson}
        onEachFeature={this.onEachFeature.bind(this)}
        style={this.getStyle}
      />
    );
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
    console.log(this.state);
    return (
      <div>
        <Map center={position} zoom={this.state.zoom} className="lfMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {this.state.geoJson ? this.renderMap() : null}
          {dialog}
        </Map>
      </div>
    );
  }
}
