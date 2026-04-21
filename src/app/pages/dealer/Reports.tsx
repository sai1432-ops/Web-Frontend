import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

interface ActivityEntry {
  id: string;
  name: string;
  time: string;
  items: string;
  orderId?: string;
  category: string;
}

export default function DealerReports() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedMonth, setSelectedMonth] = useState('October 2023');

  const targetProgress = 85;
  const targetUnits = 30;
  const completedUnits = Math.floor(targetUnits * (targetProgress / 100));

  const todayActivities: ActivityEntry[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      time: '04:45 PM',
      items: '1x Brush, 1x Paste, 2x Flyers',
      orderId: '#ORD-9821',
      category: 'PHH'
    },
    {
      id: '2',
      name: 'Sunita Devi',
      time: '03:12 PM',
      items: '2x Brush, 1x Paste',
      orderId: '#ORD-9815',
      category: 'AAY'
    },
    {
      id: '3',
      name: 'Amit Sharma',
      time: '01:20 PM',
      items: '1x Brush, 1x Flyer',
      category: 'APL'
    },
    {
      id: '4',
      name: 'Priya Patel',
      time: '11:45 AM',
      items: '2x Brush, 2x Paste',
      category: 'BPL'
    },
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dealer/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distribution Activity</h1>
                <p className="text-sm text-gray-600 mt-0.5">Track your daily distribution performance</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all font-medium border border-blue-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Select Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Illustration & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Illustration */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 p-8">
                <div className="flex items-center justify-center text-8xl">
                  👨‍💼
                </div>
              </div>
            </Card>

            {/* Progress Section */}
            <Card className="border-0 shadow-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Daily Target</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {targetProgress}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{completedUnits}</span>
                    <span className="text-xl text-gray-500">/ {targetUnits}</span>
                  </div>
                  <p className="text-sm text-gray-600">Units distributed today</p>
                </div>

                <div className="relative pt-2">
                  <div className="overflow-hidden h-4 rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transition-all duration-500"
                      style={{ width: `${targetProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Remaining</p>
                    <p className="text-xl font-bold text-orange-600">{targetUnits - completedUnits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-xl font-bold text-green-600">{completedUnits}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Activity Log */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-gray-900">Today's Activity Log</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {todayActivities.length} Entries
                  </span>
                </div>
                <p className="text-sm text-gray-600">Real-time distribution tracking</p>
              </div>
              
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {todayActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {activity.name.charAt(0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{activity.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                                {activity.category}
                              </span>
                              {activity.orderId && (
                                <span className="text-sm text-gray-600 font-medium">{activity.orderId}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-gray-900">{activity.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 font-medium">{activity.items}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Select Date</h2>
                <p className="text-sm text-blue-100 mt-0.5">View activity for a specific day</p>
              </div>
              <button 
                onClick={() => setShowDatePicker(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900">{selectedMonth}</h3>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Week days */}
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {weekDays.map((day, index) => (
                      <div key={index} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {daysInMonth.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                          selectedDate === day
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity Summary Card */}
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Activity Summary</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                      24 Entries
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">24</p>
                      <p className="text-xs text-gray-600 mt-1">Distributed</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <p className="text-xs text-gray-600 mt-1">Target</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-blue-600">18</p>
                      <p className="text-xs text-gray-600 mt-1">Families</p>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity Detail */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {todayActivities.slice(0, 2).map((activity) => (
                      <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-bold text-gray-900">{activity.name}</p>
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{activity.items}</p>
                            {activity.orderId && (
                              <p className="text-xs text-gray-600 font-medium">{activity.orderId}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                  <Button 
                    onClick={() => setShowDatePicker(false)}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-semibold shadow-lg shadow-blue-500/30"
                  >
                    View Full Report
                  </Button>
                  <Button 
                    onClick={() => setShowDatePicker(false)}
                    variant="outline"
                    className="w-full h-12 border-2 text-base font-semibold"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}