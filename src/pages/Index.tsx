import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Shield, Users, MessageCircle, Stethoscope, BookOpen, Quote } from 'lucide-react';
import heroImage from '@/assets/hero-mother-child-new.jpg';
import { AuthDialog } from '@/components/AuthDialog';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
const Index = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const features = [{
    icon: Stethoscope,
    title: 'Intelligent Symptom Checker',
    description: 'Get personalized guidance for pregnancy symptoms with our AI-powered assessment tool.',
    link: '/symptom-checker',
    color: 'bg-gradient-primary'
  }, {
    icon: MessageCircle,
    title: 'Community Support',
    description: 'Connect with other mothers and verified healthcare professionals in our safe community.',
    link: '/community',
    color: 'bg-gradient-secondary'
  }, {
    icon: BookOpen,
    title: 'Expert Articles',
    description: 'Access trusted medical articles and resources for every stage of your journey.',
    link: '/articles',
    color: 'bg-gradient-primary'
  }];

  const testimonials = [
    {
      name: "Joy Osazuwa",
      role: "A mother of four",
      testimony: "This app helped me recognize preterm labor signs with my last pregnancy. The quick advice saved us both!"
    },
    {
      name: "Gloria Duruaku",
      role: "A first-time mom",
      testimony: "As a new mom, I was constantly worried. Maternova's clear explanations gave me confidence and peace of mind."
    },
    {
      name: "Amiosinor Agbomekhe",
      role: "A single mom of two",
      testimony: "Juggling two kids alone, this app is my 24/7 health companion. The emergency alerts are truly lifesaving!"
    },
    {
      name: "Goodness Osifo",
      role: "A Great Husband and More",
      testimony: "Tracking my wife's symptoms together has greatly reduced our anxiety. We feel prepared and supported for delivery day."
    },
    {
      name: "Opeyemi Daniels",
      role: "He and his wife are planning their family",
      testimony: "The educational modules helped us create a healthy pregnancy routine as a team. It's a game-changer for family health."
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const autoplay = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 5000);

    const handleSelect = () => {
      if (api) {
        setCurrent(api.selectedScrollSnap());
      }
    };

    api.on("select", handleSelect);

    return () => {
      clearInterval(autoplay);
      api.off("select", handleSelect);
    };
  }, [api]);
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Supporting Your 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-slate-400 text-5xl"> 
                  {' '}Maternal Journey
                </span>
              </h1>
              <p className="text-medical-subheading mb-8 max-w-lg">
                Trusted medical guidance, community support, and expert care for mothers and families. 
                Your health and peace of mind are our priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/symptom-checker">
                  <Button size="lg" className="btn-medical-accent text-lg px-8 py-6 w-full">
                    Use as Guest
                  </Button>
                </Link>
                <AuthDialog>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 w-full">
                    Sign Up / Log In
                  </Button>
                </AuthDialog>
              </div>
            </div>
            
            <div className="animate-slide-up">
              <div className="relative">
                <img src={heroImage} alt="Mother and child - Maternova healthcare support" className="w-full h-auto rounded-2xl shadow-[var(--shadow-medical)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-medical-heading mb-4">Comprehensive Maternal Care</h2>
            <p className="text-medical-subheading max-w-2xl mx-auto">
              Everything you need for a healthy, informed pregnancy journey in one trusted platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Card key={index} className="card-medical-hover p-8 text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button className="btn-medical-primary">
                      Get Started
                    </Button>
                  </Link>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-medical-heading mb-6">Your Privacy & Safety First</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Medical-Grade Security</h3>
                    <p className="text-muted-foreground">Your health data is encrypted and protected with hospital-level security standards.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Verified Healthcare Professionals</h3>
                    <p className="text-muted-foreground">All medical advice comes from licensed doctors and certified healthcare providers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personalized Care</h3>
                    <p className="text-muted-foreground">Tailored guidance based on your unique health profile and pregnancy stage.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-8 card-medical">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Data Protection Promise</h3>
                <p className="text-muted-foreground mb-6">
                  Your personal health information is never shared without your explicit consent. 
                  We comply with all medical privacy regulations.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    🔒 Your data is protected and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-medical-heading mb-6">Ready to Start Your Journey?</h2>
          <p className="text-medical-subheading mb-8">
            Join thousands of mothers who trust Maternova for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/symptom-checker">
              <Button size="lg" className="btn-medical-accent text-lg px-12 py-6">
                Try Symptom Checker
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-2">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-medical-heading mb-4">What Our Community Says</h2>
            <p className="text-medical-subheading max-w-2xl mx-auto">
              Real stories from mothers and families who trust Maternova.
            </p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-card p-8 md:p-12 text-center min-h-[280px] flex flex-col justify-center">
                      <Quote className="w-10 h-10 text-primary/20 mx-auto mb-6" />
                      <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
                        "{testimonial.testimony}"
                      </p>
                      <div className="mt-auto">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>;
};
export default Index;