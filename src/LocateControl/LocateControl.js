import L from 'leaflet'
import {MapControl, withLeaflet} from 'react-leaflet'
import PropTypes from 'prop-types'

import './locate.css'

// Converts leaflet.locatecontrol to a React Component
class LocateControl extends MapControl {
  createLeafletElement(props) {
    const {options, startDirectly} = props
    const {map} = this.props.leaflet;

    const lc = L
      .control
      .locate(options)
      .addTo(map)

    if (startDirectly)
      setTimeout(() => {
        lc.start()
      }, 1000)

    return lc
  }
}

LocateControl.propTypes = {
  options: PropTypes.object, // Locate Options
  startDirectly: PropTypes.bool // Instantly start the locate control
}

export default withLeaflet(LocateControl);

