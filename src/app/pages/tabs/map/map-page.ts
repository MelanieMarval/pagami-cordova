import { Component, ElementRef, EventEmitter, Inject, OnInit, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IonSearchbar } from '@ionic/angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DrawerState } from '../../../shared/ion-bottom-drawer/drawer-state';
// Services
import { Place } from '../../../core/api/places/place';
import { ApiResponse } from '../../../core/api/api.response';
import { PlaceFilter } from '../../../core/api/places/place.filter';
import { GeolocationService } from '../../../core/geolocation/geolocation.service';
import { PlacesService } from '../../../core/api/places/places.service';
import { PagamiGeo } from '../../../core/geolocation/pagami.geo';
import { GoogleMapPage } from '../../parent/GoogleMapPage';
import { MAP_MODE, PLACES } from '../../../utils/Const';
// Providers
import { MapProvider } from '../../../providers/map.provider';
import { AlertProvider } from '../../../providers/alert.provider';
import { ToastProvider } from '../../../providers/toast.provider';
import { StorageProvider } from '../../../providers/storage.provider';
import { UserIntentProvider } from '../../../providers/user-intent.provider';
import { PhotoUtils } from '../../../utils/photo.utils';
import { User } from '../../../core/api/users/user';

const DEFAULT_TABS_HEIGHT = 48;
const DEFAULT_DRAWER_BOTTOM_HEIGHT = 30;
const DEFAULT_DRAWER_BOTTOM_POSITION = DEFAULT_TABS_HEIGHT + DEFAULT_DRAWER_BOTTOM_HEIGHT;
const DEFAULT_DRAWER_DOCKET_HEIGHT = 352;
const DEFAULT_DRAWER_DOCKET_POSITION = DEFAULT_TABS_HEIGHT + DEFAULT_DRAWER_DOCKET_HEIGHT;
const DEFAULT_DRAWER_DISTANCE_TOP = 62;
const BASIC_RADIUS_KILOMETERS = 50;
const BASIC_UPDATE_METERS = 10;

@Component({
    selector: 'app-map-page',
    templateUrl: 'map-page.html',
    styleUrls: ['map-page.scss'],
})
export class MapPage extends GoogleMapPage implements OnInit {

    @ViewChild('fab', {static: false, read: ElementRef}) private ionFab: ElementRef;
    @ViewChild('searchInput') private searchInput: IonSearchbar;

    placeTypeSelected = PLACES.TYPE.ALL;
    searching = false;

    fabAttached = true;
    bottomDrawer = {
        shouldBounce: true,
        disableDrag: false,
        distanceTop: DEFAULT_DRAWER_DISTANCE_TOP,
        dockedHeight: DEFAULT_DRAWER_DOCKET_POSITION,
        minimumHeight: DEFAULT_DRAWER_BOTTOM_POSITION,
        drawerState: DrawerState.Bottom,
        contentPosition: 0,
        hidden: false,
        showBackToolbar: false,
        disableScrollContent: true,
    };
    bottomHeightChange: EventEmitter<number> = new EventEmitter<number>();
    beforeSaveLocation = true;
    saving = false;
    placeToSave: any;
    selectedPlace: Place;
    nearPlaces: Place[] = [];
    searchPlaces: Place[] = [];
    findBusinessPlaces: Place[] = [];
    isSearching = false;
    isHiddenCloseToMe = false;
    searchText: '';
    lastSearchText = undefined;
    private profileImage: string;

    constructor(@Inject(DOCUMENT) doc: Document,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private storageService: StorageProvider,
                private alert: AlertProvider,
                private intentProvider: UserIntentProvider,
                private placesService: PlacesService,
                private renderer: Renderer2,
                private appService: MapProvider,
                private storageInstance: UserIntentProvider,
                private mapEvents: MapProvider,
                protected toast: ToastProvider,
                protected geolocationService: GeolocationService) {
        super(doc, geolocationService, toast);
    }

    async ngOnInit() {
        const user = await this.storageService.getPagamiUser();
        this.profileImage = PhotoUtils.getThumbnailPhoto(user);
        this.router.events.subscribe(value => {
            if (value instanceof NavigationEnd) {
                const url = value.url.substring(value.url.lastIndexOf('/') + 1);
                console.log('-> URL HERE', url);
                this.selectNavigateMode(url);
                if (this.previousUrl) {
                    this.previousUrl = this.currentUrl;
                    this.currentUrl = url;
                } else {
                    this.previousUrl = url;
                    this.currentUrl = url;
                }
            }
        });
        this.appService.showNearby.subscribe(() => {
            if (this.currentUrl === MAP_MODE.SEARCH) {
                this.closeToMeToDefault();
            }
        });
        this.appService.showRegister.subscribe(() => {
            // this.selectMode(this.currentUrl);
        });
        this.appService.hideNearby.subscribe(() => {
            this.focusOut();
            this.closeToMeToDefault();
            this.mapEvents.changeDrawerState.emit(DrawerState.Bottom);
            this.bottomDrawer.drawerState = DrawerState.Bottom;
            if (this.lastSearchText && !this.isSearching && !this.searchText) {
                this.getNearPlaces();
            }
        });
    }

    selectNavigateMode(mode: string) {
        switch (mode) {
            case MAP_MODE.FIND_BUSINESS:
                this.navigateToModeFindMyBusiness();
                break;
            case MAP_MODE.REGISTER_BUSINESS:
                this.navigateToModeRegister();
                break;
            case MAP_MODE.SEARCH:
                this.navigateToModeSearch();
                break;
            case MAP_MODE.SEARCHING:
                this.navigateToModeSearching();
                break;
            case MAP_MODE.EDIT_BUSINESS:
                this.navigateToModeEditBusiness();
                break;
        }
    }

    navigateToModeSearch() {
        this.isRegistering = false;
        this.isFindMyBusiness = false;
        this.isEditingBusiness = false;
        if (this.isHiddenCloseToMe) {
            this.closeToMeToDefault();
            this.isHiddenCloseToMe = false;
        }
        if (this.storageInstance.showingPlaceDetails) {
            this.storageInstance.showingPlaceDetails = false;
        }
        if (this.newPlaceMarker) {
            this.newPlaceMarker.remove();
        }
        if (this.editPlaceMarker) {
            this.editPlaceMarker.remove();
        }
        if (this.previousUrl === MAP_MODE.SEARCH && this.mapReady) {
            this.searchInput.value = '';
            this.searchText = '';
            this.isSearching = false;
            this.getNearPlaces();
            const currentStatus = this.appService.currentNearbyStatus;
            if (currentStatus !== DrawerState.Bottom) {
                this.appService.changeDrawerState.emit(DrawerState.Bottom);
            } else {
                this.appService.changeDrawerState.emit(DrawerState.Docked);
            }
        }
    }

    navigateToModeSearching() {
        this.isRegistering = false;
        this.isHiddenCloseToMe = false;
        this.isFindMyBusiness = false;
        this.onFocusSearch();
        setTimeout(() => (this.searchInput.setFocus()), 200);
    }

    navigateToModeRegister() {
        this.isRegistering = true;
        this.isFindMyBusiness = false;
        this.isHiddenCloseToMe = true;
        this.onBottomSheetHide(true);
        this.bottomHeightChange.emit(0);
        this.beforeSaveLocation = true;
        this.placeToSave = undefined;
        // this.map.panTo(this.currentPositionMarker.getPosition());
        this.map.setCameraZoom(20);
        this.addMarkerNewPlace();
        this.toast.messageSuccessAboveButton('Puedes mover un poco el marcador si lo necesitas', 3000);
        if (this.editPlaceMarker) {
            this.editPlaceMarker.remove();
        }
    }

    navigateToModeFindMyBusiness() {
        this.isRegistering = false;
        this.isFindMyBusiness = true;
        this.isHiddenCloseToMe = true;
        this.onBottomSheetHide(true);
        this.bottomHeightChange.emit(0);
        if (this.newPlaceMarker) {
            this.newPlaceMarker.remove();
        }
        if (this.editPlaceMarker) {
            this.editPlaceMarker.remove();
        }
        this.enableFindMyBusiness();
    }

    navigateToModeEditBusiness() {
        const place = this.intentProvider.placeToChangeLocation;
        this.isRegistering = false;
        this.isFindMyBusiness = false;
        this.isHiddenCloseToMe = true;
        this.isEditingBusiness = true;
        this.onBottomSheetHide(true);
        this.bottomHeightChange.emit(0);
        if (this.newPlaceMarker) {
            this.newPlaceMarker.remove();
        }
        // this.map.panTo(this.toLatLng(place.latitude, place.longitude));
        this.map.setCameraZoom(20);
        this.addMarkerEditPlace(place);
        this.toast.messageSuccessAboveButton('Presiona y arrastra tu empresa a su nueva ubicación', 3000);
    }

    closeToMeToDefault() {
        this.isRegistering = false;
        this.isHiddenCloseToMe = false;
        this.isSearching = false;
        this.isFindMyBusiness = false;
        this.bottomHeightChange.emit(DEFAULT_DRAWER_BOTTOM_POSITION);
        this.renderer.setStyle(this.ionFab.nativeElement, 'transition', '0.25s ease-in-out');
        this.renderer.setStyle(this.ionFab.nativeElement, 'transform', `translateY(-${DEFAULT_DRAWER_BOTTOM_HEIGHT}px)`);
    }

    onClickPlace(place: Place) {
        this.selectedPlace = place;
        if (this.currentUrl === MAP_MODE.FIND_BUSINESS) {
            if (place.status === PLACES.STATUS.ACCEPTED) {
                this.intentProvider.placeToShow = undefined;
                this.intentProvider.placeToClaim = place;
                this.router.navigate(['app/shop']);
            } else {
                this.toast.messageInfoForMap('No puede reclamar esta empresa <br>Ya ha sido reclamada.', 2000);
            }
        } else if (this.currentUrl === MAP_MODE.SEARCH || this.currentUrl === MAP_MODE.SEARCH) {
            console.log('MAP_MODE.SEARCH');
            this.fabAttached = false;
            this.mapEvents.changeDrawerState.emit(DrawerState.Docked);
            this.bottomDrawer.drawerState = DrawerState.Docked;
        }
    }

    onCurrentPositionChanged(coors: PagamiGeo) {
        this.setupMarkerCurrentPosition(coors);
        if ((this.fabAttached || this.isRegistering) && !this.isEditingBusiness) {
            this.moveCamera(coors);
        }
        if (this.intentProvider.lastUpdatedPoint && this.intentProvider.lastUpdatedPoint.latitude) {
            if (this.calculateDistance(this.geoToLatLng(coors), this.geoToLatLng(this.intentProvider.lastUpdatedPoint)) > BASIC_UPDATE_METERS) {
                this.getNearPlaces();
            }
        } else {
            this.getNearPlaces();
        }
    }

    onMapMoved() {
        this.fabAttached = false;
    }

    async attachedPosition() {
        this.fabAttached = true;
        if (this.currentPositionMarker) {
            this.moveCamera(await this.geolocationService.getCurrentLocation(), true);
        }
    }

    onBottomSheetHide($event: boolean) {
        if ($event) {
            this.renderer.setStyle(this.ionFab.nativeElement, 'transition', '0.25s ease-in-out');
            this.renderer.setStyle(this.ionFab.nativeElement, 'transform', `translateY(-${0}px)`);
        }
    }

    async ionViewWillEnter() {
        /**
         * moving floating button to initial position
         */
        this.renderer.setStyle(this.ionFab.nativeElement, 'transform', `translateY(-${DEFAULT_DRAWER_BOTTOM_HEIGHT}px)`);
        /**
         * load map and wait
         */
        this.loadMap();
        /**
         * subscribing to current location changes
         */
        // TODO comentado porque se llamaba multiples veces, por reparar
        this.geolocationService.locationChanged.subscribe(
            (coors: PagamiGeo) => {
                if (this.mapReady) {
                    this.onCurrentPositionChanged(coors);
                }
            });
        /**
         * Enable watch location if status is disabled
         */
        this.geolocationService.enableLocation();
        /**
         * set center and marker position
         */
        const geo: PagamiGeo = await this.geolocationService.getCurrentLocation();
        this.onCurrentPositionChanged(geo);
        this.getNearPlaces();
    }

    async ionViewWillLeave() {
        // this.stopMap();
    }

    async getNearPlaces() {
        if (this.searching) {
            return;
        }
        this.searching = true;
        const geo: PagamiGeo = await this.geolocationService.getCurrentLocation();
        const filter: PlaceFilter = {
            latitude: geo.latitude,
            longitude: geo.longitude,
            radius: BASIC_RADIUS_KILOMETERS,
        };
        this.searchText ? filter.text = this.searchText : delete filter.text;
        if (this.placeTypeSelected !== PLACES.TYPE.ALL) {
            filter.placeType = this.placeTypeSelected;
        }
        this.placesService.getNearby(filter).then((success: ApiResponse) => {
            if (success.passed) {
                this.searchPlaces = success.response;
                this.setupPlacesToDrawer(this.searchPlaces);
                this.setupPlacesToMap(this.searchPlaces);
                this.intentProvider.lastUpdatedPoint = geo;
                this.lastSearchText = filter.text;
            }
        }, error => {
            console.log('-> error', error);
        }).finally(() => this.searching = false);
    }

    async getAcceptedPlaces() {
        this.placesService.getAllAccepted().then((success: ApiResponse) => {
            if (success.passed) {
                this.findBusinessPlaces = success.response;
            }
        });
    }

    setupPlacesToDrawer(places: Place[]) {
        places.forEach(place => {
            const latlng = this.toLatLng(
                place.latitude,
                place.longitude,
            );
            place.distance = this.calculateDistance(
                this.currentPositionMarker.getPosition(),
                latlng,
            );
        });
        places.sort((a, b) => a.distance - b.distance);
        this.nearPlaces = places;
    }

    onDrawerPositionChange(position: number) {
        this.bottomDrawer.showBackToolbar = this.bottomDrawer.distanceTop === position;
    }

    onScrollContent(position: number) {
        this.bottomDrawer.contentPosition = position;
    }

    onDrawerStateChange($event: DrawerState) {
        this.bottomDrawer.drawerState = $event;
        if (this.bottomDrawer.drawerState === DrawerState.Bottom) {
            this.selectedPlace = undefined;
        }
    }

    async saveLocation() {
        this.saving = true;
        const latLng = this.newPlaceMarker.getPosition();
        const location = await this.getAddress(latLng.lat, latLng.lng);
        const place: Place = {
            latitude: latLng.lat,
            longitude: latLng.lng,
            location: {
                addressLine: location.addressLine,
                postalCode: location.postalCode,
                city: location.city,
                state: location.state,
                country: location.country,
                acronym: location.acronym,
            },
        };
        this.placesService.save(place)
            .then(async (success: any) => {
                if (success.passed === true) {
                    await this.toast.messageSuccessAboveButton('Ubicación guardada exitosamente');
                    this.placeToSave = success.response;
                    this.beforeSaveLocation = false;
                    this.saving = false;
                } else {
                    this.saving = false;
                    if (success.code === 31) {
                        await this.toast.messageErrorAboveButton('Ha excedido el numero de registros por este dia.');
                    } else {
                        await this.toast.messageErrorAboveButton('No se ha guardar la ubicacion. Intente de nuevo!');
                    }
                }
            }, reason => {
                this.saving = false;
                this.toast.messageErrorAboveButton('No se ha guardar la ubicacion por problemas internos. Intente mas tarde!');
            });
    }

    getAddress(lat: number, lng: number): Promise<any> {
        return new Promise(resolve => {
            this.placesService.getPlaceByGeocode(lat, lng)
                .then(response => {
                    const address = response.results;
                    const infoPlace = address[0].address_components;
                    resolve({
                        addressLine: address[0].formatted_address,
                        postalCode: infoPlace.slice(-1)[0].long_name,
                        city: infoPlace.slice(-5)[0].long_name,
                        state: infoPlace.slice(-3)[0].long_name,
                        country: infoPlace.slice(-2)[0].long_name,
                        acronym: infoPlace.slice(-2)[0].short_name,
                    });
                });
        });
    }

    navigateToBusinessDetails() {
        this.storageInstance.placeToEdit = this.placeToSave;
        this.beforeSaveLocation = true;
        this.placeToSave = undefined;
        this.saving = false;
        this.router.navigateByUrl('/app/business-payment-details');
    }

    onFocusSearch() {
        this.router.navigateByUrl('/app/tabs/map/searching').then(r => {
            this.bottomDrawer.drawerState = DrawerState.Top;
            // this.bottomDrawer.disableDrag = true;
            this.mapEvents.changeDrawerState.emit(DrawerState.Top);
            this.isSearching = true;
        });
    }

    onFocusExit() {
        // this.bottomDrawer.disableDrag = false;
        // this.isSearching = false;
        // this.searchInput.value = '';
    }

    onPlaceTypeChanged(selected: string) {
        this.placeTypeSelected = selected;
        this.selectedPlace = undefined;
        if (this.mapReady && !this.searching) {
            this.getNearPlaces();
        }
    }

    onSearch(event) {
        this.searchText = event.target.value.toLowerCase(); // TODO
    }

    onHideKeyboard(event) {
        event.target.blur();
        this.getNearPlaces();
    }

    focusOut() {
        const activeElement: any = document.activeElement;
        activeElement.blur();
    }

    async saveNewLocation() {
        this.saving = true;
        const latLng = this.editPlaceMarker.getPosition();
        const location = await this.getAddress(latLng.lat, latLng.lng);
        const newPlaceLocation: Place = {
            id: this.intentProvider.placeToChangeLocation.id,
            latitude: latLng.lat,
            longitude: latLng.lng,
            location: {
                address: this.intentProvider.placeToChangeLocation.location.address,
                addressLine: location.addressLine,
                postalCode: location.postalCode,
                city: location.city,
                state: location.state,
                country: location.country,
                acronym: location.acronym,
            },
        };
        this.placesService.changeLocation(newPlaceLocation)
            .then((success: any) => {
                if (success.passed === true) {
                    this.toast.messageSuccessWithoutTabs('Ubicación actualizada exitosamente', 3000, 'success');
                    this.saving = false;
                    this.storageService.setBusinessVerifiedByUser(success.response.place).then(() => {
                        this.isRegistering = false;
                        this.isEditingBusiness = false;
                        this.isSearching = false;
                        this.isFindMyBusiness = false;
                        this.router.navigate(['/app/settings/my-business']).then(() => {
                            this.getNearPlaces();
                        });
                    });
                } else {
                    this.saving = false;
                    this.toast.messageErrorAboveButton('No se ha guardar la ubicacion. Intente de nuevo!');
                }
            }, reason => {
                this.saving = false;
                this.toast.messageErrorAboveButton('No se ha guardar la ubicacion por problemas de conexion. Intente mas tarde!');
            });
    }

    clickOnNearbyBar() {
        // this.bottomDrawer.drawerState = DrawerState.Top;
    }

    onClear() {
        this.searchText = '';
        this.getNearPlaces();
    }

    async goToRegisterBusiness() {
        const user: User = await this.storageService.getPagamiUser();
        if (user.phone && user.location.address) {
            await this.router.navigateByUrl('/app/tabs/map/register-business');
        } else {
            this.alert.alertCompleteProfile();
        }
    }

    goToMap() {
        this.searchText = '';
        this.searchInput.value = '';
        this.isSearching = false;
        this.router.navigateByUrl('/app/tabs/map/search');
        this.appService.showNearby.emit();
        this.appService.changeDrawerState.emit(DrawerState.Bottom);
        this.getNearPlaces();
    }
}
