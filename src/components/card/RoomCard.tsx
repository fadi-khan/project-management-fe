import React from 'react';
// Assuming you have Lucide React icons or similar for facilities, bed type, etc.
// Example: import { Wifi, Coffee, Utensils, Tv, BedSingle, Calendar } from 'lucide-react';

// Mocking the enums for demonstration
const RoomStatus = { ACTIVE: 'Active', INACTIVE: 'Inactive', OCCUPIED: 'Occupied' };
const RoomType = { STANDARD: 'Standard', DELUXE: 'Deluxe', SUITE: 'Suite' };
const BedType = { SINGLE: 'Single', DOUBLE: 'Double', QUEEN: 'Queen', KING: 'King' };
const RoomFacility = { TV: 'TV', WIFI: 'WiFi', BREAKFAST: 'Breakfast' };

// Mocking the Room data structure
export const mockRoom = {
    roomNo: 'R022',
    status: RoomStatus.ACTIVE, // Or INACTIVE, OCCUPIED
    facilities: [RoomFacility.TV, RoomFacility.WIFI, RoomFacility.BREAKFAST],
    checkInDate: new Date('2025-01-28T14:00:00Z'),
    checkOutDate: new Date('2025-01-30T11:00:00Z'),
    price: 199.00,
    discountedPrice: 159.20,
    roomType: RoomType.STANDARD,
    bedType: BedType.QUEEN,
};

export const RoomCard = ({ room }:{room:any}) => {
    // Helper function to format dates
    const formatDate = (date) => date ? new Date(date).toDateString() : 'N/A';

    // // Determine status color
    const typeColor = room.roomType === RoomType.DELUXE ? 'bg-red-500' :
        'bg-blue-900';

    return (
        <div className=" mx-auto w-fit bg-white rounded-xl shadow-lg overflow-hidden border   my-4">
            <div className="md:flex w-full">
                {/* Image Section (Placeholder) */}
                <div className="md:shrink-0 relative">
                    <img className=" w-full h-40  md:h-full object-cover md:w-48" src="/homeSlider/room2.avif" alt="Hotel room" />
                    <span className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white rounded-full ${typeColor}`}>
                        {room.roomType}
                    </span>
                </div>

                {/* Content Section */}
                <div className="md:p-8 p-3 flex flex-col justify-between">
                    <div>
                        <div className=" uppercase tracking-wide text-md text-blue-800 font-semibold">
                              Room **<span className='ps-1'>{room.roomNo}</span>**
                        </div>
                        <p className="mt-2 text-gray-500">
                            {room.bedType} Bed &bull; {room.facilities?.join(', ')} {/* Display facilities clearly */}
                        </p>
                    </div>

                    {/* Booking Dates (Optional display if applicable) */}
                    {room.checkOutDate && (
                        <div className="mt-4 text-gray-600 flex gap-2 text-md">
                            <span className='font-bold text-red-500 '>Booked Till</span>
                            <span>  {formatDate(room.checkOutDate)} </span>
                        </div>
                    )}

                    {/* Pricing and Action Button */}
                    <div className="mt-4 flex items-center justify-between w-full gap-x-4 pb-4 md:py-0">
                        <div>
                            {room.discountedPrice ? (
                                <p className="text-2xl font-bold text-gray-900">
                                    ${room.discountedPrice.toFixed(2)}
                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                        ${room.price.toFixed(2)}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">
                                    ${room.price.toFixed(2)}
                                </p>
                            )}
                        </div>
                        <button className="px-4 py-2 bg-blue-800 cursor-pointer text-white text-sm font-medium rounded hover:bg-indigo-700">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};