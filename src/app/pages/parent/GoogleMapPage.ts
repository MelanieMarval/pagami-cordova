import { ElementRef, Inject, ViewChild } from '@angular/core';
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
    GoogleMapsAnimation,
    MyLocation,
    LatLng, Environment, MarkerOptions, GoogleMapOptions, ILatLng,
} from '@ionic-native/google-maps';

declare var MarkerClusterer: any;

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

export class GoogleMapPage {

    @ViewChild('mapCanvas', {static: true}) mapElement: ElementRef;
    map: GoogleMap;
    currentPositionMarker: Marker;
    currentPositionCircle: any;
    private nearbyPlaces: any[];
    private acceptPlaces: any[];
    private markerCluster: any;
    googleMaps: any;
    accuracy: number;
    currentUrl: string;
    mapReady = false;
    newPlaceMarker: Marker;
    editPlaceMarker: any;
    lastPosition: any;
    isRegistering = false;
    isFindMyBusiness = false;
    isEditingBusiness = false;

    constructor(@Inject(DOCUMENT) private doc: Document, protected geolocationService: GeolocationService) {
    }

    loadMap() {
        this.mapReady = false;
        try {
            const mapEle = this.mapElement.nativeElement;
            this.map = GoogleMaps.create(mapEle, this.getDefaultOptions());
            // this.googleMaps = await this.geolocationService.getGoogleMaps();
            // this.map = new this.googleMaps.Map(mapEle, this.getDefaultOptions());

            // this.googleMaps.event.addListenerOnce(this.map, 'idle', () => {
            //     mapEle.classList.add('show-map');
            this.onMapReady();
            this.mapMoveSubscribe();
            this.map.clear();
            // });
            this.mapReady = true;
        } catch (err) {
            this.mapReady = false;
        }
    }

    private mapMoveSubscribe() {
        // this.map.addListener('drag', () => {
        //     this.onMapMoved();
        // });
    }

    onMapMoved() {
    }

    onMapReady() {
        this.map.one(GoogleMapsEvent.MAP_READY).then(
            (data) => {
                console.log('Click MAP', data);
                const currentZoom: number = this.map.getCameraZoom();
                this.map.setCameraZoom(currentZoom - 1);
            });
    }

    changeMapCenter(coords: PagamiGeo) {
        console.log('-> coords', coords);
        this.map.animateCamera({
            target: {lat: coords.latitude, lng: coords.longitude},
            zoom: 17,
            tilt: 1,
            bearing: 140,
            duration: 500,
        }).then(() => {
            console.log('Camera target has been changed');
        });
        // this.map.panTo(position);
    }

    enableFindMyBusiness() {

    }

    async setupMarkerCurrentPosition(coords: PagamiGeo) {
        const position: any = {
            lat: coords.latitude,
            lng: coords.longitude,
        };
        if (this.currentPositionMarker === undefined) {
            const options: MarkerOptions = {
                icon: {
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                    fillColor: '#F6AD55',
                    fillOpacity: 1,
                    scale: 6,
                    path: 0,
                },
                position,
                draggable: false,
            };
            this.currentPositionMarker = this.map.addMarkerSync(options);
            console.log('-> this.currentPositionMarker', this.currentPositionMarker);

            // this.currentPositionCircle = new this.googleMaps.Circle({
            //     center: position,
            //     radius: /*this.accuracy*/30, // in meters
            //     strokeColor: '#F6AD55',
            //     strokeWeight: 0.5,
            //     fillColor: '#FBD38D',
            //     fillOpacity: 0.2,
            //     // map,
            // });
        } else {
            // if (this.currentPositionMarker) {
            //     this.currentPositionMarker.setPosition(position);
            // }
            // if (this.currentPositionCircle) {
            //     this.currentPositionCircle.setRadius(/*coords.accuracy*/30);
            //     this.currentPositionCircle.setCenter(position);
            // }
        }
    }

    addMarkerNewPlace() {
        if (this.currentPositionMarker) {
            const options: MarkerOptions = {
                icon: {
                    url: 'assets/marker-icons/point_marker.svg',
                    size: {
                        width: 64,
                        height: 64,
                    },
                },
                position: this.currentPositionMarker.getPosition(),
                draggable: true,
            };

            this.newPlaceMarker = this.map.addMarkerSync(options);

            this.lastPosition = this.currentPositionMarker.getPosition();

            // this.newPlaceMarker.addListener('drag', event => {
            //     this.onDragPlaceEvents();
            // });
            // this.newPlaceMarker.addListener('dragend', event => {
            //     this.onDragPlaceEvents();
            // });
        }
    }

    addMarkerEditPlace(place: Place) {
        const map = this.map;
        if (this.currentPositionMarker) {
            const latLng = this.toLatLng(place.latitude, place.longitude);
            const options: MarkerOptions = {
                icon: {
                    url: 'assets/marker-icons/point_marker.svg',
                    size: {
                        width: 64,
                        height: 64,
                    },
                },
                position: latLng,
                draggable: true,
                zIndex: 50,
            };

            this.editPlaceMarker = this.map.addMarkerSync(options);

            // if (this.editPlaceMarker) {
            //     this.editPlaceMarker.setMap(null);
            // }
        }
    }

    onDragPlaceEvents() {
        if (this.calculateDistance(this.newPlaceMarker.getPosition(), this.currentPositionMarker.getPosition()) > 30) {
            this.newPlaceMarker.setPosition(this.lastPosition);
        } else {
            this.lastPosition = this.newPlaceMarker.getPosition();
        }
    }

    onClickPlace(place: Place) {
    }

    setupPlacesToMap(places: Place[]) {
        this.clearMarkerPlaces();
        for (const place of places) {
            const position: any = {
                lat: place.latitude,
                lng: place.longitude,
            };
            const options: MarkerOptions = {
                icon: {
                    url: PlaceUtils.getMarker(place),
                    size: {
                        width: 30,
                        height: 32,
                    },
                },
                position,
                draggable: true,
                zIndex: 50,
            };

            const marker: Marker = this.map.addMarkerSync(options);

            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                const latlng = { lat: position.lat, lng: position.lng };
                this.onClickPlace(place);
                if (this.currentUrl === MAP_MODE.SEARCH) {
                    this.map.setCameraZoom(20);
                    this.offsetCenter(latlng, 0, 200);
                }
            });
            this.nearbyPlaces.push(marker);
        }
        this.setCluster();
        if (this.isEditingBusiness && this.editPlaceMarker) {
            this.editPlaceMarker.setMap(null);
            this.editPlaceMarker.setMap(this.map);
        }
    }

    clearMarkerPlaces() {
        if (this.nearbyPlaces) {
            for (const marker of this.nearbyPlaces) {
                marker.setMap(null);
            }
        }
        if (this.markerCluster) {
            this.markerCluster.clearMarkers();
        }
        this.nearbyPlaces = [];
    }

    offsetCenter(latlng, offsetx, offsety) {
        const scale = Math.pow(2, this.map.getCameraZoom());
        // const worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(latlng);
        // const pixelOffset = new GoogleMaps.Point((offsetx / scale) || 0, (offsety / scale) || 0);
        //
        // const worldCoordinateNewCenter = new GoogleMaps.Point(
        //     worldCoordinateCenter.x - pixelOffset.x,
        //     worldCoordinateCenter.y + pixelOffset.y,
        // );
        // const newCenter = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        // this.map.setCenter(newCenter);
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
            },
            controls: {
                zoom: false,
            },
            styles: removeDefaultMarkers,
        };
    }

    /**
     * return distance on meters
     */
    // calculateDistance(front: LatLng, to: LatLng): number {
    //     return GoogleMaps.geometry.spherical.computeDistanceBetween(front, to);
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

    // @ts-ignore
    toLatLng(lat: number, lng: number): LatLng {
        // return new GoogleMaps.LatLng(lat, lng);
    }

    // @ts-ignore
    geoToLatLng(geo: PagamiGeo): LatLng {
        // return new GoogleMaps.LatLng(geo.latitude, geo.longitude);
    }

    setCluster() {
        this.markerCluster = new MarkerClusterer(this.map, this.nearbyPlaces, this.getClusterOptions());
    }

    getClusterOptions(): any {
        const clusterStyles = [
            {
                textColor: 'white',
                url: 'assets/map_cluster.svg',
                height: 36,
                width: 36,
            },
            {
                textColor: 'white',
                url: 'assets/map_cluster.svg',
                height: 36,
                width: 36,
            },
            {
                textColor: 'white',
                url: 'assets/map_cluster.svg',
                height: 36,
                width: 36,
            },
        ];
        return {
            gridSize: 50,
            styles: clusterStyles,
            maxZoom: 16,
        };
    }
}
