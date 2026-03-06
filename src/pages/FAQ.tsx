import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "Is my personal health data safe?",
      answer: "Yes, we prioritize your privacy and comply with data protection standards."
    },
    {
      question: "Can I use this app without internet?",
      answer: "Core symptom checking works offline, but consultations require connectivity."
    },
    {
      question: "Is this app a replacement for doctor visits?",
      answer: "No, it's a support tool. Always consult healthcare providers for medical decisions."
    },
    {
      question: "How much does it cost?",
      answer: "The app is completely free to use."
    }
  ];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-medical-subheading max-w-2xl mx-auto">
            Find answers to common questions about Maternova and how we support your maternal healthcare journey.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-muted/50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you with any concerns or queries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
