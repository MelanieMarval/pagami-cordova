import { Component, Directive, ElementRef, Inject, Injectable, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { PagamiGeo } from '../../core/geolocation/pagami.geo';
import { Place } from '../../core/api/places/place';
import { MAP_MODE } from '../../utils/Const';
import { PlaceUtils } from '../../utils/place.utils';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    Marker,
    Circle,
    ILatLng,
    LatLng,
    MarkerOptions,
    GoogleMapOptions, MarkerCluster, MarkerClusterOptions, Spherical,
} from '@ionic-native/google-maps';
import { ToastProvider } from '../../providers/toast.provider';
import { MapUtils } from '../../utils/map.utils';

const removeDefaultMarkers = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
            {visibility: 'off'},
        ],
    },
];

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

@Injectable()
// tslint:disable-next-line:directive-class-suffix
export abstract class GoogleMapPage {

    map: GoogleMap;
    currentPositionMarker: Marker;
    currentPositionCircle: Circle;
    /**
     * Currently List of marker options for cluster
     */
    private markersForCluster: MarkerOptions[] = [];
    /**
     * Currently List of places to show
     */
    private nearbyPlaces: Place[] = [];
    /**
     * Currently marker cluster
     */
    private markerCluster: MarkerCluster;
    accuracy: number;
    currentUrl = MAP_MODE.SEARCH;
    previousUrl: string;
    mapReady = false;
    newPlaceMarker: Marker;
    editPlaceMarker: Marker;
    lastPosition: any;
    isRegistering = false;
    isFindMyBusiness = false;
    isEditingBusiness = false;

    protected constructor(@Inject(DOCUMENT) private doc: Document,
                          protected geolocationService: GeolocationService,
                          protected toast: ToastProvider) {
    }

    loadMap(mapElement: ElementRef) {
        this.mapReady = false;
        try {
            const mapEle = mapElement.nativeElement;
            console.log('-> mapEle', mapEle);
            this.map = GoogleMaps.create(mapEle, this.getDefaultOptions());
            console.log('-> map', this.map);

            this.onMapReady();
            this.mapMoveSubscribe();
            // this.map.clear();
            this.mapReady = true;
        } catch (err) {
            console.log('-> err', err);
            this.mapReady = false;
        }
    }

    private mapMoveSubscribe() {
        this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(() => {
            this.onMapMoved();
        });
    }

    onMapMoved() {
    }

    onMapReady() {
        this.map.one(GoogleMapsEvent.MAP_READY)
            .then((data) => {
                console.log('MAP is ready');
                console.log('-> data', data);
                // const currentZoom: number = this.map.getCameraZoom();
                // console.log('-> currentZoom', currentZoom);
                // this.map.setCameraZoom(currentZoom - 1);
            });
    }

    /**
     * This method will change camera position from a coors
     * @param coords: coors to center camera
     * @param forced: if should forced zoom to change too
     */
    moveCamera(coords: PagamiGeo | LatLng, forced = false) {
        // console.log('-> coords', coords);
        this.map.animateCamera({
            target: (coords instanceof LatLng) ? coords : {lat: coords.latitude, lng: coords.longitude},
            zoom: MapUtils.calculateZoomToCenter(this.map, forced),
            tilt: 1,
            duration: 500,
        }).then(() => {
            // console.log('Camera target has been changed');
        });
    }

    enableFindMyBusiness() {

    }

    async setupMarkerCurrentPosition(coords: PagamiGeo) {
        const position: any = {
            lat: coords.latitude,
            lng: coords.longitude,
        };
        if (!this.currentPositionMarker) {
            const options: MarkerOptions = {
                icon: {
                    url: './assets/marker-icons-png/pagami_center.png',
                    size: {
                        width: 18,
                        height: 18,
                    },
                    anchor: {
                        x: 9,
                        y: 9,
                    },
                },
                position,
                draggable: false,
            };
            this.currentPositionMarker = this.map.addMarkerSync(options);

            this.currentPositionCircle = await this.map.addCircle({
                center: position,
                radius: /*coords.accuracy*/30, // meters
                strokeColor: '#F6AD55',
                strokeWidth: 0.5,
                fillColor: 'rgba(251,211,141,0.20)',
            });

            this.map.moveCamera({
                target: this.currentPositionCircle.getBounds(),
            });

        } else {
            if (this.currentPositionMarker) {
                this.currentPositionMarker.setPosition(position);
            }
            if (this.currentPositionCircle) {
                this.currentPositionCircle.setRadius(/*coords.accuracy*/30);
                this.currentPositionCircle.setCenter(position);
            }
        }
    }

    addMarkerNewPlace() {
        if (this.currentPositionMarker) {
            const options: MarkerOptions = {
                icon: {
                    url: './assets/marker-icons-png/point_marker.png',
                    size: {
                        width: 28,
                        height: 64,
                    },
                },
                position: this.currentPositionMarker.getPosition(),
                draggable: true,
            };
            if (this.newPlaceMarker) {
                this.newPlaceMarker.remove();
            }

            this.newPlaceMarker = this.map.addMarkerSync(options);

            this.lastPosition = this.currentPositionMarker.getPosition();

            this.newPlaceMarker.on(GoogleMapsEvent.MARKER_DRAG_START).subscribe(event => {
                console.log('-> event Drag_Start', event);
                // this.onDragPlaceEvents();
            });
            this.newPlaceMarker.on(GoogleMapsEvent.MARKER_DRAG).subscribe(event => {
                console.log('-> event Drag', event);
                // this.onDragPlaceEvents();
            });
            this.newPlaceMarker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(event => {
                console.log('-> event Drag_End', event);
                this.onDragPlaceEvents();
            });
        }
    }

    addMarkerEditPlace(place: Place) {
        console.log('-> place', place);
        if (this.currentPositionMarker) {
            const latLng = this.toLatLng(place.latitude, place.longitude);
            const options: MarkerOptions = {
                icon: {
                    url: './assets/marker-icons-png/point_marker.png',
                    size: {
                        width: 28,
                        height: 64,
                    },
                },
                position: latLng,
                draggable: true,
                // zIndex: 50,
            };
            if (this.editPlaceMarker) {
                this.editPlaceMarker.remove();
            }
            this.editPlaceMarker = this.map.addMarkerSync(options);
            this.moveCamera(latLng);
        }
    }

    onDragPlaceEvents() {
        if (this.calculateDistance(this.newPlaceMarker.getPosition(), this.currentPositionMarker.getPosition()) > 30) {
            this.newPlaceMarker.setPosition(this.lastPosition);
            this.toast.messageSuccessAboveButton('No te salgas del espacio delimitado');
        } else {
            this.lastPosition = this.newPlaceMarker.getPosition();
        }
    }

    onClickPlace(place: Place) {
    }

    async setupPlacesToMap(places: Place[]) {
        this.clearMarkerPlaces();
        for (const place of places) {
            const position = new LatLng(place.latitude, place.longitude);
            const options: MarkerOptions = {
                icon: {
                    url: PlaceUtils.getMarker(place),
                    size: {
                        width: 28,
                        height: 32,
                    },
                },
                position,
                draggable: false,
                zIndex: 50,
                place,
            };

            this.markersForCluster.push(options);
            this.nearbyPlaces.push(place);
        }
        this.setCluster();
        if (this.isEditingBusiness && this.editPlaceMarker) {
            // this.editPlaceMarker.setVisible(false); // remove() or setVisible(false)
            // this.addMarkerEditPlace(this.intentProvider.placeToChangeLocation);
            // this.editPlaceMarker.setVisible(true);
        }
        this.map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(value => {
            console.log('marker click');
            console.log(value);
        });
    }

    clearMarkerPlaces() {
        if (this.markerCluster && this.map) {
            this.markerCluster.remove();
        }
        this.markersForCluster = [];
    }

    offsetCenter(latlng, offsetx, offsety) {
        const scale = Math.pow(2, this.map.getCameraZoom());
        const worldCoordinateCenter = this.map.fromLatLngToPoint(latlng);
        const pixelOffset = Spherical.computeOffset(latlng, (offsetx / scale) || 0, (offsety / scale) || 0);
        // const worldCoordinateNewCenter = new GoogleMaps.Point(
        //     worldCoordinateCenter.x - pixelOffset.x,
        //     worldCoordinateCenter.y + pixelOffset.y,
        // );
        // const newCenter = this.map.fromPointToLatLng(worldCoordinateNewCenter);
        // this.map.setCenter(pixelOffset);
        this.moveCamera(pixelOffset, true);
    }

    getDefaultOptions(): GoogleMapOptions {
        return {
            camera: {
                target: {
                    lat: 6.286155564435256,
                    lng: -75.6074854019129,
                },
                zoom: 18,
                tilt: 1,
            },
            gestures: {
                tilt: false,
                rotate: true,
            },
            controls: {
                zoom: false,
                mapToolbar: false,
                myLocationButton: false,
            },
            styles: removeDefaultMarkers,
        };
    }

    /**
     * return distance on meters
     */
    // calculateDistance(front: LatLng, to: LatLng): number {
    //     return new GoogleMaps.geometry.spherical.computeDistanceBetween(front, to);
    // }

    calculateDistance(point1: ILatLng, point2: ILatLng) {
        // The radius of the planet earth in meters
        const R = 6378137;
        const dLat = degreesToRadians(point2.lat - point1.lat);
        const dLong = degreesToRadians(point2.lng - point1.lng);
        const a = Math.sin(dLat / 2)
            *
            Math.sin(dLat / 2)
            +
            Math.cos(degreesToRadians(point1.lat))
            *
            Math.cos(degreesToRadians(point1.lat))
            *
            Math.sin(dLong / 2)
            *
            Math.sin(dLong / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toLatLng(lat: number, lng: number): LatLng {
        return new LatLng(lat, lng);
    }

    geoToLatLng(geo: PagamiGeo): LatLng {
        return new LatLng(geo.latitude, geo.longitude);
    }

    setCluster() {
        this.markerCluster = this.map.addMarkerClusterSync(this.getClusterOptions());

        this.markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe(next => {
            const latLng: LatLng = next[0];
            const marker: Marker = next[1];
            const place: Place = marker.get('place');
            if (place) {
                this.onClickPlace(place);
                if (this.currentUrl === MAP_MODE.SEARCH) {
                    // this.moveCamera(latLng, true);
                    // this.map.panBy(0, -100);
                    // this.offsetCenter(latLng, 0, 200);
                }
                console.log('-> place clicked', place);
            }
        });
    }

    getClusterOptions(): MarkerClusterOptions {
        return {
            markers: this.markersForCluster,
            maxZoomLevel: 18,
            boundsDraw: false,
            icons: [
                {
                    label: {color: 'white'},
                    min: 2,
                    url: './assets/map_cluster.png',
                    size: {
                        height: 36,
                        width: 36,
                    },
                },
                {
                    label: {color: 'white'},
                    min: 2,
                    url: './assets/map_cluster.png',
                    size: {
                        height: 36,
                        width: 36,
                    },
                },
                {
                    label: {color: 'white'},
                    min: 2,
                    url: './assets/map_cluster.png',
                    size: {
                        height: 36,
                        width: 36,
                    },
                },
            ],
        };
    }

}
