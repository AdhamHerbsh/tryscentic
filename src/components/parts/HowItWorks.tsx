import Accordion from "@/components/ui/Accordion"

export default function HowItWorks() {
    const data = [
        {
            title: "How to Redeem",
            children: "To redeem your gift card, simply enter the unique code at checkout. The gift card amount will be automatically deducted from your total purchase. Enjoy your new signature scent!",
        },
        {
            title: "How to Return?",
            children: "If you need to return a gift card, please contact our customer support team. They will guide you through the process and provide you with a refund or replacement options.",
        }
    ];
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="border-t border-gray-600 mb-4">
                <Accordion data={data} />
            </div>
        </div>
    )
}
