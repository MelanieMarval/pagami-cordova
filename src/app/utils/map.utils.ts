import { GoogleMap } from '@ionic-native/google-maps';

const MAP_MIN_CENTER_ZOOM_ACCEPTED = 15;
const MAP_CENTER_ZOOM = 18;

export class MapUtils {

    /**
     * This method will calculate zoom to center in the map
     * @param map: to extract current zoom
     * @param change: if should change zoom
     */
    static calculateZoomToCenter(map: GoogleMap, change: boolean): number {
        const currentZoom: number = map.getCameraZoom();
        if (currentZoom < MAP_MIN_CENTER_ZOOM_ACCEPTED && change) {
            return MAP_CENTER_ZOOM;
        } else {
            return currentZoom;
        }
    }
}
