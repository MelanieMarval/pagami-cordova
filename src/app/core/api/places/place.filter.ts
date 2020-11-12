export interface PlaceFilter {
    latitude: number;
    longitude: number;
    radius: number; // kilometers
    countryAcronym?: string
    placeType?: string;
    text?: string;
}
