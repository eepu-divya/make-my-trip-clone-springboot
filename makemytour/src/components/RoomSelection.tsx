import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Bed, Users, Wifi, Coffee, Tv, Bath, Star, DollarSign, Eye } from 'lucide-react';

interface RoomSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  requiredRooms: number;
  onConfirm: (rooms: string[]) => void;
}

interface RoomInfo {
  id: string;
  type: 'standard' | 'deluxe' | 'suite';
  name: string;
  price: number;
  available: boolean;
  amenities: string[];
  maxGuests: number;
  bedType: string;
  size: string;
  view: string;
}

export default function RoomSelection({ isOpen, onClose, hotelId, requiredRooms, onConfirm }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | '3d'>('grid');
  const [previewRoom, setPreviewRoom] = useState<RoomInfo | null>(null);

  useEffect(() => {
    // Initialize rooms
    const roomTypes = [
      {
        type: 'standard' as const,
        name: 'Standard Room',
        basePrice: 0,
        amenities: ['Wifi', 'TV', 'AC'],
        maxGuests: 2,
        bedType: 'Queen Bed',
        size: '250 sq ft',
        view: 'City View'
      },
      {
        type: 'deluxe' as const,
        name: 'Deluxe Room',
        basePrice: 50,
        amenities: ['Wifi', 'TV', 'AC', 'Mini Bar', 'Coffee Maker'],
        maxGuests: 3,
        bedType: 'King Bed',
        size: '350 sq ft',
        view: 'Garden View'
      },
      {
        type: 'suite' as const,
        name: 'Executive Suite',
        basePrice: 150,
        amenities: ['Wifi', 'TV', 'AC', 'Mini Bar', 'Coffee Maker', 'Jacuzzi', 'Living Area'],
        maxGuests: 4,
        bedType: 'King Bed + Sofa Bed',
        size: '600 sq ft',
        view: 'Ocean View'
      }
    ];

    const initialRooms: RoomInfo[] = [];
    roomTypes.forEach((roomType) => {
      // Create 10 rooms of each type
      for (let i = 1; i <= 10; i++) {
        const roomNumber = `${roomType.type.charAt(0).toUpperCase()}${String(i).padStart(2, '0')}`;
        initialRooms.push({
          id: roomNumber,
          ...roomType,
          price: roomType.basePrice,
          available: Math.random() > 0.4 // 60% availability
        });
      }
    });

    setRooms(initialRooms);
  }, [hotelId]);

  const handleRoomClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.available) return;

    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      if (selectedRooms.length < requiredRooms) {
        setSelectedRooms([...selectedRooms, roomId]);
      } else {
        // Replace the first room if limit reached
        setSelectedRooms([...selectedRooms.slice(1), roomId]);
      }
    }
  };

  const getTotalPrice = () => {
    return selectedRooms.reduce((total, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      return total + (room?.price || 0);
    }, 0);
  };

  const handleConfirm = () => {
    if (selectedRooms.length === requiredRooms) {
      onConfirm(selectedRooms);
      onClose();
    } else {
      alert(`Please select ${requiredRooms} room(s)`);
    }
  };

  const getRoomIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      'Wifi': Wifi,
      'TV': Tv,
      'Coffee Maker': Coffee,
      'Mini Bar': Coffee,
      'Jacuzzi': Bath
    };
    const Icon = icons[amenity] || Check;
    return <Icon className="w-4 h-4" />;
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.type]) acc[room.type] = [];
    acc[room.type].push(room);
    return acc;
  }, {} as Record<string, RoomInfo[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bed className="w-6 h-6" />
            Select Your Rooms
          </DialogTitle>
          <DialogDescription>
            Choose {requiredRooms} room(s) for your stay
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Selection */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                {/* Select Your Rooms */}
                Grid View
              </Button>
              <Button
                variant={viewMode === '3d' ? 'default' : 'outline'}
                onClick={() => setViewMode('3d')}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                3D Preview
              </Button>
            </div>

            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {Object.entries(groupedRooms).map(([type, roomList]) => (
                  <Card key={type}>
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold capitalize">{type} Rooms</h3>
                          <div className="flex items-center gap-2">
                            {type === 'suite' && (
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Star className="w-4 h-4 fill-yellow-600" />
                                <span className="text-sm font-semibold">Premium</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{roomList[0].bedType} • {roomList[0].size} • {roomList[0].view}</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {roomList[0].amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                            {getRoomIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Room Grid */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {roomList.map((room) => {
                          const isSelected = selectedRooms.includes(room.id);
                          return (
                            <button
                              key={room.id}
                              onClick={() => handleRoomClick(room.id)}
                              onMouseEnter={() => setPreviewRoom(room)}
                              onMouseLeave={() => setPreviewRoom(null)}
                              disabled={!room.available}
                              className={`aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center text-xs font-semibold
                                ${!room.available ? 'bg-gray-300 cursor-not-allowed' : ''}
                                ${isSelected ? 'bg-green-500 text-white border-green-600' : ''}
                                ${room.available && !isSelected ? 'bg-white hover:bg-blue-50 border-gray-300' : ''}
                              `}
                              title={`Room ${room.id} - ${room.name} ${room.price > 0 ? `+$${room.price}` : ''}`}
                            >
                              {isSelected ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <span>{room.id}</span>
                              )}
                              {room.price > 0 && (
                                <span className="text-[10px] mt-0.5">+${room.price}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {roomList[0].price > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>+${roomList[0].price} per night upgrade</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-12 mb-4">
                    <Bed className="w-24 h-24 mx-auto text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">3D Room Preview</h3>
                    <p className="text-gray-600 mb-4">
                      Interactive 3D room tours coming soon!
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {['Standard', 'Deluxe', 'Suite'].map((type) => (
                        <div key={type} className="bg-white p-4 rounded-lg shadow">
                          <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                          <p className="text-sm font-semibold">{type} Room</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode('grid')}
                  >
                    Back to Grid View
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Hover Preview */}
            {previewRoom && viewMode === 'grid' && (
              <Card className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Bed className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">Room {previewRoom.id}</h4>
                      <p className="text-sm text-gray-600 mb-2">{previewRoom.name}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{previewRoom.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{previewRoom.bedType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1 w-xl">
            <Card className="sticky top-4 max-h-[calc(90vh-110px)] w-xl">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Selection Summary</h3>
                  <p className="text-sm text-gray-600">
                    {selectedRooms.length} of {requiredRooms} room(s) selected
                  </p>
                </div>

                {/* Selected Rooms */}
                <div className="space-y-2">
                  {selectedRooms.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No rooms selected</p>
                  ) : (
                    selectedRooms.map((roomId) => {
                      const room = rooms.find(r => r.id === roomId);
                      if (!room) return null;
                      return (
                        <div key={roomId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">
                              {roomId}
                            </div>
                            <div className="text-sm">
                              <p className="font-semibold">{room.name}</p>
                              <p className="text-xs text-gray-600">{room.bedType}</p>
                              {room.price > 0 && (
                                <p className="text-xs text-green-600">+${room.price}/night</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRoomClick(roomId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Premium Features */}
                {selectedRooms.some(id => {
                  const room = rooms.find(r => r.id === id);
                  return room?.type === 'suite' || room?.type === 'deluxe';
                }) && (
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Star className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div className="text-xs">
                            <p className="font-semibold text-yellow-800 mb-1">Premium Benefits:</p>
                            <ul className="space-y-1 text-yellow-700">
                              <li>• Late checkout available</li>
                              <li>• Welcome drink</li>
                              <li>• Room service discount</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Total Cost */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Room Upgrades:</span>
                    <span className="font-semibold">${getTotalPrice()}/night</span>
                  </div>
                  {getTotalPrice() > 0 && (
                    <p className="text-xs text-gray-500">
                      Will be added to your total booking amount
                    </p>
                  )}
                </div>

                {/* Save Preferences */}
                <div className="border-t pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Save my room preferences</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleConfirm}
                    disabled={selectedRooms.length !== requiredRooms}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    Confirm Rooms
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full text-white"
                  >
                    Skip for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}