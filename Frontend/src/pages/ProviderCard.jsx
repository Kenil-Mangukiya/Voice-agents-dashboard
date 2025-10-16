import React, { useState } from "react";

const ProviderCard = ({ provider, selectedCategory, getCategoryCardBg, getCategoryCardColor, providerCallCounts, countsLoading, onClick }) => {
    const [showBeds, setShowBeds] = React.useState(false);
    const [showManualForm, setShowManualForm] = React.useState(false);
  
    const openBeds =15;
    const sampleFirstNames = ["Rohan", "Kajal", "Amir", "Sofia", "Rahul", "Mina", "David", "Anita", "Priya", "John", "Asha", "Ravi", "Sana", "Ali", "Karan"];
    const sampleLastNames = ["Mehta", "Verma", "Khan", "Martinez", "Patel", "Singh", "Shah", "Brown", "Gupta", "Roy", "Naidu", "Gomez", "Das", "Lopez", "Bhatt"];
    const bookings = Array.from({ length: 15 }).map((_, i) => ({
      first: sampleFirstNames[i % sampleFirstNames.length],
      last: sampleLastNames[i % sampleLastNames.length],
      date: `1 Night Stay - ${Math.floor(Math.random() * 12) + 1}/10/2025`,
    }));
  
    return (
      <div
        className={`p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 transform ${getCategoryCardBg(selectedCategory.color)} hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] cursor-pointer w-full`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{provider.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{provider.issue}</p>
  
            {/* Open Beds Section */}
            {selectedCategory.id === 'homelessness' && (
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBeds(!showBeds);
                  }}
                  className="text-sm px-3 py-2 bg-orange-100 text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-200 transition-all font-medium"
                >
                  🏠 Open Beds: {openBeds}
                </button>
  
                {showBeds && (
                  <div className="mt-4 border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 font-semibold">First Name</th>
                          <th className="px-4 py-2 font-semibold">Last Name</th>
                          <th className="px-4 py-2 font-semibold">Bed Reserved From</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{b.first}</td>
                            <td className="px-4 py-2">{b.last}</td>
                            <td className="px-4 py-2">{b.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
  
                    {/* Add Manual Booking Button */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowManualForm(!showManualForm);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        + Add Manual Booking
                      </button>
                    </div>
  
                    {/* Manual Booking Form (visual only) */}
                    {showManualForm && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <h4 className="text-base font-semibold mb-3">Manual Booking Form (Visual Only)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input placeholder="First Name" className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                          <input placeholder="Last Name" className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                          <input placeholder="Bed Reserved From" className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                          <input placeholder="Number of Beds" className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                          <input placeholder="Contact" className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                          <textarea placeholder="Notes" className="border border-gray-300 rounded-lg px-3 py-2 w-full col-span-2" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
  
            {/* Calls Routed / Phones Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-gray-900">{provider.phones.length}</span>
                <span className="text-xs text-gray-500">Phone Numbers</span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-teal-500">
                  {countsLoading ? (
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    providerCallCounts[provider.name] || 0
                  )}
                </span>
                <span className="text-xs text-gray-500">Calls Routed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default ProviderCard;
