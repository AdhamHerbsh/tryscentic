"use client";

export default function PromoCodesSection() {
    const PrimaryOrange = '#F0A020';

    return (
        <section className="mb-10 text-white"> 
            
            <h2 className="text-xl font-semibold mb-4">Promo Codes</h2>
            <div className="flex text-sm mb-4 border-b border-gray-700">
               
                <button 
                    className="pb-2 mr-6 font-semibold" 
                    style={{ borderBottom: `2px solid ${PrimaryOrange}` }}>
                    Available
                </button>
              
                <button className="text-gray-400 pb-2">
                    Used
                </button>
            </div>
            <div className="space-y-4">
                <div
                    className="mb-10 rounded-xl p-6 flex justify-between items-center"
                    style={{ backgroundColor: 'rgba(255, 255, 223, 0.53)' }}
                >
                    <div>
                        <h3 className="font-semibold text-base">SUMMER20</h3> 
                        <p className="text-gray-200 text-sm">
                            20% off on all summer fragrances. Expires: 30/08/2024
                        </p>
                    </div>
                    <button
                        className="font-semibold text-sm hover:underline"
                        style={{ color: PrimaryOrange }}
                    >
                        COPY CODE
                    </button>
                </div>
                <div
                    className="mb-10 rounded-xl p-6 flex justify-between items-center"
                    style={{ backgroundColor: 'rgba(255, 255, 223, 0.53)' }}
                >
                    <div>
                        <h3 className="font-semibold text-base">FREESHIP</h3>
                        <p className="text-gray-200 text-sm">
                            Free shipping on orders over $100. Expires: 31/12/2024
                        </p>
                    </div>
                    <button
                        className="font-semibold text-sm hover:underline"
                        style={{ color: PrimaryOrange }}
                    >
                        COPY CODE
                    </button>
                </div>
            </div>
        </section>
    );
}
