import { MouseEventHandler, useState } from "react";
import { Plus, X } from "lucide-react";

interface Props {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: MouseEventHandler;
}

// Single FAQ Item Component
function FAQItem({ question, answer, isOpen, onToggle }: Props) {
  return (
    <div className="border-b border-gray-400 border-opacity-30">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-amber-400"
      >
        <h3 className="text-lg font-semibold text-white sm:text-xl">
          {question}
        </h3>
        <span className="ml-4 flex-shrink-0">
          {isOpen ? (
            <X className="h-6 w-6 text-amber-400" />
          ) : (
            <Plus className="h-6 w-6 text-amber-400" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="pb-6 pr-12">
          <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

// Main FAQ Component
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Where can I watch?",
      answer:
        "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis.",
    },
    {
      question: "Mauris id nibh eu fermentum mattis purus?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Eros imperdiet rhoncus?",
      answer:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "Fames imperdiet quam fermentum?",
      answer:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "Varius vitae, convallis amet lacus sit aliquet nibh?",
      answer:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "Tortor nisl pellentesque sit quis orci dolor?",
      answer:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    },
    {
      question:
        "Vestibulum mauris mauris elementum proin amet auctor ipsum nibh sollicitudin?",
      answer:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Decorative Image (Optional) */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-30 lg:block">
        <img
          src="assets/images/logo/logo-icon-1200x1200.png"
          alt="Decorative perfume"
          className="object-contain"
        />
      </div>

      <div className="container relative mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
