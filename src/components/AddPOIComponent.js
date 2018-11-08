import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { geolocated } from 'react-geolocated';
import LocationSearching from '@material-ui/icons/LocationSearching';
import LocationDisabled from '@material-ui/icons/LocationDisabled';
import Grid from '@material-ui/core/Grid';
import { Button, IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class AddPOIComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 51.505,
        lng: -0.09
      },
      marker: {
        lat: 51.505,
        lng: -0.09
      },
      zoom: 13,
      draggable: true,
      submitter: '',
      name: '',
      comment: ''
    };
    this.refmarker = React.createRef();

    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submitForm() {
    fetch('https://c01.j-service.de/gisstuff', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        type: 'place',
        submitter: this.state.submitter,
        name: this.state.name,
        comment: this.state.comment,
        loc: {
          lat: this.state.marker.lat,
          lon: this.state.marker.lng
        },
        status: 'needs review'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('Woopie');
    });
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable });
  };

  updatePosition = () => {
    const marker = this.refmarker.current;
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng()
      });
    }
  };

  handleChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState(() => ({ [name]: value }));
  };

  setUserPosition = () => {
    const marker = this.refmarker.current;
    if (marker != null) {
      this.setState({
        marker: {
          lat: this.props.coords.latitude,
          lng: this.props.coords.longitude
        },
        center: {
          lat: this.props.coords.latitude,
          lng: this.props.coords.longitude
        },
        zoom: 13
      });
    }
  };

  render() {
    const currentPosition = this.props.coords ? (
      <div>
        <IconButton onClick={this.setUserPosition} aria-label="Pick Position">
          <LocationSearching />
          <Typography>
            {' '}
            Use current position ({this.props.coords.latitude.toFixed(3)},
            {this.props.coords.longitude.toFixed(3)}){' '}
          </Typography>
        </IconButton>
      </div>
    ) : (
      <div>Getting the location data&hellip; </div>
    );

    const geoLocationPart = !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <div>
        <LocationDisabled aria-label="Location picking is disabled" />
        <Typography variant="body1">No position available</Typography>
      </div>
    ) : (
      currentPosition
    );

    const position = [this.state.center.lat, this.state.center.lng];
    const markerPosition = [this.state.marker.lat, this.state.marker.lng];

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Map center={position} zoom={this.state.zoom} className="pickerMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              draggable={this.state.draggable}
              onDragend={this.updatePosition}
              position={markerPosition}
              ref={this.refmarker}
            >
              <Popup minWidth={90}>
                <span onClick={this.toggleDraggable}>
                  {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                </span>
              </Popup>
            </Marker>
          </Map>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            User Position
          </Typography>
          {geoLocationPart}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Marker Position
          </Typography>
          <TextField
            disabled
            label="Latitude"
            value={markerPosition[0]}
            margin="normal"
          />
          <TextField
            disabled
            label="Longitude"
            value={markerPosition[1]}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            General
          </Typography>
          <TextField
            label="Submitter"
            name="submitter"
            value={this.state.submitter}
            onChange={this.handleChange}
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
          />
          <TextField
            label="Comment"
            name="comment"
            value={this.state.comment}
            onChange={this.handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={this.submitForm}>Submit</Button>
        </Grid>
      </Grid>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(AddPOIComponent);
