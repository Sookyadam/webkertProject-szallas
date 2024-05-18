export interface Hotel {
    id?: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number;
    availableFrom: Date;
    availableTo: Date;
    image: string;
}
