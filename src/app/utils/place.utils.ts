import { Place } from '../core/api/places/place';
import { PLACES } from './Const';
import { WeekDayHours } from '../core/api/places/week-day-hours';
import { BusinessHours } from '../core/api/places/business-hours';

export class PlaceUtils {

    static getThumbnailPhoto(register: Place) {
        if (register.status === 'INCOMPLETE' || !register.photoUrl) {
            return'assets/img/no-business-image.png';
        } else {
            const arrayPhoto = register.photoUrl.split('?');
            return `${arrayPhoto[0]}_64x64?${arrayPhoto[1]}`;
        }
    }

    static getMessageStatus(status: string): string {
        switch (status) {
            case PLACES.STATUS.WAITING:
                return 'Esperando aceptacion';
            case PLACES.STATUS.ACCEPTED:
                return 'En espera de verificacion';
            case PLACES.STATUS.VERIFIED:
                return 'Verificado';
            case PLACES.STATUS.REJECTED:
                return 'Rechazado';
            case PLACES.STATUS.INCOMPLETE:
                return 'Incompleto';
            default:
                return 'Desabilitado';
        }
    }

    static getTypeSpanish(type: string): string {
        switch (type) {
            case PLACES.TYPE.SERVICE:
                return 'SERVICIO';
            case PLACES.TYPE.STORE:
                return 'TIENDA';
        }
    }

    static getMessageDistance(distance: number): string {
        if (distance === 0) {
           return `Estas aqui.`;
        } else if (distance > 2000) {
            return `A ${Math.trunc(distance / 1000)} kilometros de ti.`;
        } else {
            return `A ${Math.trunc(distance)} metros de ti.`;
        }
    }

    static getMarker(place: Place, suffix = true): string {
        const base = './assets/marker-icons-png';
        if (place.category.icon === 'abasto') {
            return `${base}/abasto${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'barberia_y_peluqueria') {
            return `${base}/peluqueria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'cafe') {
            return `${base}/cafe${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'estacionamiento_motos') {
            return `${base}/estacionamiento_motos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'estacionamiento_vehiculos') {
            return `${base}/estacionamiento_vehiculos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'fabrica') {
            return `${base}/fabrica${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'farmacia') {
            return `${base}/farmacia${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'fruteria') {
            return `${base}/fruteria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'gimnasio') {
            return `${base}/gimnasio${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'heladeria') {
            return `${base}/heladeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'hotel') {
            return `${base}/hotel${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'hotel') {
            return `${base}/hotel${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'negocio_temporal') {
            return `${base}/negocio_temporal${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'odontologia') {
            return `${base}/odontologia${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'odontologia') {
            return `${base}/odontologia${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'pagami') {
            return `${base}/pagami${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'panaderia') {
            return `${base}/panaderia${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'perfumeria') {
            return `${base}/perfumeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'piscina') {
            return `${base}/piscina${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'pizzeria') {
            return `${base}/pizzeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'restaurante') {
            return `${base}/restaurante${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'servicio_de_reparacion') {
            return `${base}/servicio_reparacion${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'servicios_medicos') {
            return `${base}/servicio_medico${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'servicio_tecnico') {
            return `${base}/servicio_tecnico${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'taller_motos') {
            return `${base}/taller_motos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'taller_vehiculos') {
            return `${base}/taller_vehiculos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'taxi') {
            return `${base}/taxi${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'tienda_deporte') {
            return `${base}/tienda_deporte${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'tienda_motos') {
            return `${base}/tienda_motos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'tienda_vehiculos') {
            return `${base}/tienda_vehiculos${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'tienda_ropa') {
            return `${base}/tienda_ropa${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'veterinario') {
            return `${base}/veterinario${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'servicios') {
            return `${base}/servicios${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === '3dcorte') {
            return `${base}/3dcorte${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'calzado') {
            return `${base}/calzado${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'carniceria') {
            return `${base}/carniceria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'cerrajeria') {
            return `${base}/cerrajeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'diseno_programacion') {
            return `${base}/diseno_programacion${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'naturista') {
            return `${base}/naturista${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'reparacion_llantas') {
            return `${base}/reparacion_llantas${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'solucionesempr') {
            return `${base}/solucionesempr${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'turismo') {
            return `${base}/turismo${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'vivero') {
            return `${base}/vivero${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'joyeria') {
            return `${base}/joyeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'relojeria') {
            return `${base}/relojeria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'muebles') {
            return `${base}/muebles${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'casa_cambio') {
            return `${base}/casa_cambio${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'optica') {
            return `${base}/optica${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'negocio_de_bebidas') {
            return `${base}/licoreria${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else if (place.category.icon === 'comida_rapida') {
            return `${base}/comida_rapida${PlaceUtils.getIconSuffix(place, suffix)}`;
        } else {
            return `${base}/tienda${PlaceUtils.getIconSuffix(place, suffix)}`;
        }
    }

    private static getIconSuffix(place: Place, suffix) {
        const ext = '.png';
        if (place.status === PLACES.STATUS.VERIFIED && suffix) {
            if (place.hours) {
                if (!PlaceUtils.placeIsOpen(place.hours)) {
                    return `_inactivo${ext}`;
                }
            }
            return `_verificado${ext}`;
        } else if (place.status === PLACES.STATUS.ACCEPTED && suffix) {
            return `_aceptado${ext}`;
        } else {
            return `_icono${ext}`;
        }
    }

    static getSortData(registers): any[] {
        return registers.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    }

    static placeIsOpen(daysHours: BusinessHours) {
        const currentDay = new Date();

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[currentDay.getDay()];

        const hours: WeekDayHours = daysHours[dayName];
        if (!hours.active) {
            return false;
        }
        const currentHour = currentDay.getHours();
        const currentMinute = currentDay.getMinutes();
        let from = hours.hoursOne.from.split(':')[0];
        let to = hours.hoursOne.to.split(':')[0];
        let toMin = hours.hoursOne.to.split(':')[1];
        if ((Number(currentHour) >= Number(from)) && (Number(currentHour) <= Number(to))) {
            return currentHour !== Number(to) || currentMinute < Number(toMin);
        } else {
            if (hours.breakTime) {
                from = hours.hoursTwo.from.split(':')[0];
                to = hours.hoursTwo.to.split(':')[0];
                toMin = hours.hoursTwo.to.split(':')[1];
                if ((Number(currentHour) >= Number(from)) && (Number(currentHour) <= Number(to))) {
                    return currentHour !== Number(to) || currentMinute < Number(toMin);
                }
            }
            return false;
        }
    }

}
