import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface AccordionData {
    title: string;
    children: React.ReactNode;
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border-b border-slate-200">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-5 focus:outline-none"
            >
                <span className="font-medium">{title}</span>
                <span
                    className={`transition-transform duration-300`}
                >
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </span>
            </button>
            <div
                ref={contentRef}
                style={{
                    maxHeight: isOpen ? contentRef.current?.scrollHeight : '0px',
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div className="pb-5 text-sm text-slate-200">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Accordion: React.FC<{ data: AccordionData[] }> = ({ data }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="x-auto px-4">
            {data.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                >
                    {item.children}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
