import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Plane, Star, DollarSign } from 'lucide-react';

interface SeatSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  flightId: string;
  requiredSeats: number;
  onConfirm: (seats: string[]) => void;
}

const SEAT_ROWS = 20;
const SEATS_PER_ROW = 6;
const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface SeatInfo {
  id: string;
  type: 'economy' | 'premium' | 'business';
  price: number;
  available: boolean;
}

export default function SeatSelection({ isOpen, onClose, flightId, requiredSeats, onConfirm }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Record<string, SeatInfo>>({});
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  useEffect(() => {
    // Initialize seats
    const initialSeats: Record<string, SeatInfo> = {};
    for (let row = 1; row <= SEAT_ROWS; row++) {
      for (const letter of SEAT_LETTERS) {
        const seatId = `${row}${letter}`;
        let type: 'economy' | 'premium' | 'business' = 'economy';
        let price = 0;

        // First 3 rows are business class
        if (row <= 3) {
          type = 'business';
          price = 150;
        }
        // Rows 4-7 are premium economy
        else if (row <= 7) {
          type = 'premium';
          price = 75;
        }
        // Rest are economy
        else {
          type = 'economy';
          price = 0;
        }

        // Exit row seats are premium
        if (row === 10 || row === 11) {
          price = Math.max(price, 50);
        }

        // Randomly make some seats unavailable (simulating booked seats)
        const available = Math.random() > 0.3;

        initialSeats[seatId] = { id: seatId, type, price, available };
      }
    }
    setSeats(initialSeats);
  }, [flightId]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats[seatId];
    if (!seat.available) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        // Replace the first seat if limit reached
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      }
    }
  };

  const getSeatColor = (seat: SeatInfo, isSelected: boolean, isHovered: boolean) => {
    if (!seat.available) return 'bg-gray-300 cursor-not-allowed';
    if (isSelected) return 'bg-green-500 text-white';
    if (isHovered) return 'bg-blue-300';

    switch (seat.type) {
      case 'business':
        return 'bg-purple-100 hover:bg-purple-200';
      case 'premium':
        return 'bg-blue-100 hover:bg-blue-200';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      return total + (seats[seatId]?.price || 0);
    }, 0);
  };

  const handleConfirm = () => {
    if (selectedSeats.length === requiredSeats) {
      onConfirm(selectedSeats);
      onClose();
    } else {
      alert(`Please select ${requiredSeats} seat(s)`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Plane className="w-6 h-6" />
            Select Your Seats
          </DialogTitle>
          <DialogDescription>
            Choose {requiredSeats} seat(s) for your flight
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  ">
          {/* Seat Map */}
          <div className="lg:col-span-3 overflow-auto pr-2">
            {/* Legend */}
            <Card className="mb-4">
              <CardContent className="p-4 ">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 border rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 border rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 border rounded"></div>
                    <span>Business (+$150)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 border rounded"></div>
                    <span>Premium (+$75)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Grid */}
            <div className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-lg border-2">
              {/* Cockpit */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-t-full inline-block">
                  <Plane className="w-8 h-8 mx-auto" />
                  <p className="text-xs mt-1">Cockpit</p>
                </div>
              </div>

              {/* Seats */}
              <div className="space-y-3">
                {Array.from({ length: SEAT_ROWS }, (_, rowIndex) => {
                  const row = rowIndex + 1;
                  const isExitRow = row === 10 || row === 11;

                  return (
                    <div key={row}>
                      {isExitRow && (
                        <div className="text-center text-xs text-orange-600 font-semibold py-1 bg-orange-50 rounded mb-1">
                          🚪 Emergency Exit Row - Extra Legroom (+$50)
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2">
                        {/* Row number */}
                        <div className="w-8 text-center text-sm font-semibold text-gray-600">
                          {row}
                        </div>

                        {/* Left side seats (A, B, C) */}
                        <div className="flex gap-1">
                          {SEAT_LETTERS.slice(0, 3).map((letter) => {
                            const seatId = `${row}${letter}`;
                            const seat = seats[seatId];
                            if (!seat) return null;
                            const isSelected = selectedSeats.includes(seatId);
                            const isHovered = hoveredSeat === seatId;

                            return (
                              <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId)}
                                onMouseEnter={() => setHoveredSeat(seatId)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                disabled={!seat.available}
                                className={`w-8 h-8 rounded-t-lg border-2 transition-all text-xs font-semibold
                                  ${getSeatColor(seat, isSelected, isHovered)}
                                  ${seat.available ? 'cursor-pointer' : 'cursor-not-allowed'}
                                `}
                                title={`${seatId} - ${seat.type} ${seat.price > 0 ? `+$${seat.price}` : ''}`}
                              >
                                {isSelected ? <Check className="w-4 h-4 mx-auto" /> : letter}
                              </button>
                            );
                          })}
                        </div>

                        {/* Aisle */}
                        <div className="w-8 text-center text-xs text-gray-400">
                          {row === 1 && '🚶'}
                        </div>

                        {/* Right side seats (D, E, F) */}
                        <div className="flex gap-1">
                          {SEAT_LETTERS.slice(3, 6).map((letter) => {
                            const seatId = `${row}${letter}`;
                            const seat = seats[seatId];
                            if (!seat) return null;
                            const isSelected = selectedSeats.includes(seatId);
                            const isHovered = hoveredSeat === seatId;

                            return (
                              <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId)}
                                onMouseEnter={() => setHoveredSeat(seatId)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                disabled={!seat.available}
                                className={`w-8 h-8 rounded-t-lg border-2 transition-all text-xs font-semibold
                                  ${getSeatColor(seat, isSelected, isHovered)}
                                  ${seat.available ? 'cursor-pointer' : 'cursor-not-allowed'}
                                `}
                                title={`${seatId} - ${seat.type} ${seat.price > 0 ? `+$${seat.price}` : ''}`}
                              >
                                {isSelected ? <Check className="w-4 h-4 mx-auto" /> : letter}
                              </button>
                            );
                          })}
                        </div>

                        {/* Row number */}
                        <div className="w-8 text-center text-sm font-semibold text-gray-600">
                          {row}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1 w-xl ">
            <Card className="sticky top-4 max-h-[calc(90vh-110px)] w-xl">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Selection Summary</h3>
                  <p className="text-sm text-gray-600">
                    {selectedSeats.length} of {requiredSeats} seat(s) selected
                  </p>
                </div>

                {/* Selected Seats */}
                <div className="space-y-2">
                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No seats selected</p>
                  ) : (
                    selectedSeats.map((seatId) => {
                      const seat = seats[seatId];
                      return (
                        <div key={seatId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">
                              {seatId}
                            </div>
                            <div className="text-sm">
                              <p className="font-semibold capitalize">{seat.type}</p>
                              {seat.price > 0 && (
                                <p className="text-xs text-green-600">+${seat.price}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleSeatClick(seatId)}
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
                {selectedSeats.some(id => seats[id]?.type !== 'economy') && (
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Star className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <div className="text-xs">
                          <p className="font-semibold text-yellow-800 mb-1">Premium Benefits:</p>
                          <ul className="space-y-1 text-yellow-700">
                            <li>• Extra legroom</li>
                            <li>• Priority boarding</li>
                            <li>• Free beverages</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Total Cost */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Seat Upgrades:</span>
                    <span className="font-semibold">${getTotalPrice()}</span>
                  </div>
                  {getTotalPrice() > 0 && (
                    <p className="text-xs text-gray-500">
                      Will be added to your total booking amount
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleConfirm}
                    disabled={selectedSeats.length !== requiredSeats}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    Confirm Seats
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