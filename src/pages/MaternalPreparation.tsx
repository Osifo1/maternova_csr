import { Baby, ShoppingBag, Building2, BookOpen, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import heroImage from '@/assets/maternal-prep-hero.jpg';

const MaternalPreparation = () => {
  const essentialItems = [
    {
      name: "Baby Clothes",
      description: "Soft cotton onesies, sleepers, and socks",
      why: "Newborns need 5-7 outfit changes per day. Soft fabrics protect delicate skin.",
      recommended: true,
    },
    {
      name: "Baby Bath Tub",
      description: "Small plastic tub for safe bathing",
      why: "Keeps baby safe during bath time. Prevents slipping.",
      recommended: true,
      product: {
        price: "₦2,300",
        vendor: "MamaCare Stores",
      }
    },
    {
      name: "Diapers & Wipes",
      description: "Newborn size diapers and gentle wipes",
      why: "Essential for hygiene. Babies use 8-12 diapers daily.",
      recommended: true,
      product: {
        price: "₦1,800/pack",
        vendor: "BabyEssentials NG",
      }
    },
    {
      name: "Receiving Blankets",
      description: "Soft, breathable blankets for wrapping baby",
      why: "Keeps baby warm and comfortable. Good for swaddling.",
      recommended: true,
    },
    {
      name: "Feeding Bottles & Nipples",
      description: "BPA-free bottles with slow-flow nipples",
      why: "Necessary for formula feeding or expressed breast milk.",
      recommended: false,
    },
    {
      name: "Baby Thermometer",
      description: "Digital thermometer for checking temperature",
      why: "Monitor baby's health. Detect fever early.",
      recommended: true,
      product: {
        price: "₦950",
        vendor: "HealthFirst Nigeria",
      }
    },
  ];

  const vendors = [
    {
      name: "MamaCare Stores",
      categories: "Baby Clothes, Blankets, Accessories",
      priceRange: "₦500 - ₦5,000",
      verified: true,
    },
    {
      name: "BabyEssentials NG",
      categories: "Diapers, Wipes, Hygiene Products",
      priceRange: "₦800 - ₦3,500",
      verified: true,
    },
    {
      name: "HealthFirst Nigeria",
      categories: "Medical Supplies, Thermometers",
      priceRange: "₦400 - ₦4,000",
      verified: true,
    },
    {
      name: "Little Angels Shop",
      categories: "Feeding Equipment, Bath Items",
      priceRange: "₦600 - ₦6,000",
      verified: true,
    },
  ];

  const clinics = [
    {
      name: "Maternova Primary Health Centre",
      address: "12 Wellness Road, Gbagada, Lagos",
      services: "24/7 Delivery • Prenatal Care • Emergency Support",
      note: "Equipped to handle unexpected delivery complications quickly.",
    },
    {
      name: "SafeMother Clinic",
      address: "45 Hospital Avenue, Ikeja, Lagos",
      services: "Natural Birth • C-Section • Postnatal Care",
      note: "Experienced midwives and doctors available round the clock.",
    },
    {
      name: "Hope for Mothers Center",
      address: "8 Community Street, Surulere, Lagos",
      services: "Low-Cost Delivery • Family Planning • Vaccination",
      note: "Affordable care for low-income families. Subsidized services available.",
    },
  ];

  const educationalResources = [
    {
      title: "What to Pack for Delivery",
      content: "Pack your hospital bag by week 36. Include: comfortable clothes, toiletries, baby clothes, diapers, feeding supplies, important documents (ID, health insurance), phone charger, snacks, and a going-home outfit for you and baby.",
    },
    {
      title: "Warning Signs During Pregnancy",
      content: "Seek immediate medical help if you experience: severe headaches, blurred vision, severe abdominal pain, vaginal bleeding, reduced baby movements, severe swelling, fever above 38°C, or fluid leaking from vagina.",
    },
    {
      title: "Preparing Your Home for Baby",
      content: "Create a safe sleep space with a firm mattress. Keep the room at comfortable temperature. Remove loose blankets and toys from crib. Install smoke detectors. Baby-proof electrical outlets. Keep medicines and cleaning products locked away.",
    },
    {
      title: "Postpartum Essentials",
      content: "After delivery, you'll need: maternity pads, comfortable underwear, nursing bras, pain relief medication, stool softeners, nipple cream, breast pump (if needed), healthy snacks, water bottle, and support from family.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Mother preparing for baby arrival" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Baby className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Maternal Preparation Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to prepare for your baby's arrival. From essential items to trusted clinics, we're here to support your journey.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Section 1: Baby Preparation Essentials */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-primary" />
              Baby Preparation Essentials
            </h2>
            <p className="text-muted-foreground">
              Being prepared before delivery reduces stress and helps you focus on your health and baby. 
              Here's what you need to have ready before your due date.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    {item.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Why it's needed:</p>
                    <p className="text-sm">{item.why}</p>
                  </div>
                  
                  {item.product && (
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm font-semibold text-primary mb-1">
                        Discounted Price: {item.product.price}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        From {item.product.vendor}
                      </p>
                      <Button size="sm" className="w-full">
                        View Vendor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 2: Verified Vendor Marketplace */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-primary" />
              Verified Vendor Marketplace
            </h2>
            <p className="text-muted-foreground">
              Shop from trusted sellers offering quality baby items at affordable prices. 
              All vendors are verified by Maternova for your safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {vendors.map((vendor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{vendor.name}</CardTitle>
                    {vendor.verified && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Categories:</span> {vendor.categories}</p>
                    <p className="text-sm"><span className="font-medium">Price Range:</span> {vendor.priceRange}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    Contact Vendor
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: Partner Clinics & Delivery Centers */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              Partner Clinics & Delivery Centers
            </h2>
            <p className="text-muted-foreground">
              Choose from our trusted network of maternal health facilities. 
              All clinics are equipped with trained staff and emergency equipment.
            </p>
          </div>

          <div className="space-y-6">
            {clinics.map((clinic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{clinic.name}</CardTitle>
                  <CardDescription className="space-y-2 text-base">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                      <span>{clinic.address}</span>
                    </p>
                    <p className="font-medium text-foreground">{clinic.services}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <p className="text-sm text-foreground">{clinic.note}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      View Clinic
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Clinic
                    </Button>
                    <Button variant="secondary">
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: Educational Resources */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              Educational Resources
            </h2>
            <p className="text-muted-foreground">
              Learn everything you need to know about preparing for delivery, caring for your newborn, 
              and taking care of yourself after birth.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {educationalResources.map((resource, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold">
                      {resource.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {resource.content}
                      </p>
                      <Button variant="link" className="mt-3 p-0 h-auto text-primary">
                        Read More →
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need More Support?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team of healthcare professionals is here to help you every step of the way. 
            Connect with our community or speak to a health advisor today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Join Community
            </Button>
            <Button size="lg" variant="outline">
              Contact Support
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MaternalPreparation;
