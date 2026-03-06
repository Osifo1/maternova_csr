import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkedinIcon, Mail, MapPin } from 'lucide-react';
import osifaImage from '@/assets/team-osifo-new.jpg';
import jenniferImage from '@/assets/team-jennifer-updated.jpg';
import ogashiImage from '@/assets/team-ogashi-new.jpg';

const Team = () => {
  const teamMembers = [
    {
      name: 'Osifo Goodness',
      role: 'AI/ML Engineer',
      company: '3MTT C3 Fellow, Nigeria',
      image: osifaImage,
      description: 'Osifo Goodness is an AI/ML Engineer and 3MTT C3 Fellow, Nigeria, passionate about using technology to strengthen primary healthcare systems. He is a Daray Certified AI/ML Engineer and a graduate of the University of Port Harcourt. His work focuses on healthcare AI and machine learning applications for community health. He is open for collaboration, and you can connect with him on LinkedIn.',
      linkedin: 'https://www.linkedin.com/in/goodness-osifo'
    },
    {
      name: 'Dr. Jennifer Jude Whyte',
      role: 'Cybersecurity Expert',
      company: '3MTT C3 Fellow, Nigeria', 
      image: jenniferImage,
      description: 'Dr. Jennifer Jude Whyte is a Cybersecurity Expert and a 3MTT C3 Fellow, Nigeria. A graduate of the University of Benin and a Daray Certified Cybersecurity Expert, she combines her security background with expertise in data protection and healthcare cybersecurity. Her interests lie in family medicine, healthcare technology, and safeguarding patient data. She is open to collaboration, and you can connect with her on LinkedIn',
      linkedin: 'https://www.linkedin.com/in/jenny-jude-whytte/'
    },
    {
      name: 'Ogashi Endurance',
      role: 'AI/ML Engineer',
      company: '3MTT C3 Fellow, Nigeria',
      image: ogashiImage,
      description: 'Ogashi Endurance is an AI/ML Engineer and 3MTT C3 Fellow, Nigeria, with a strong interest in children\'s healthcare and natural language processing. He is a Daray Certified AI/ML Engineer and a graduate of Delta State University. His expertise lies in developing AI-driven solutions for healthcare applications, with a focus on system architecture and NLP. He is open for collaboration, and you can connect with him on LinkedIn.',
      linkedin: 'https://www.linkedin.com/in/endurance-ogashi-638444173/'
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-medical-heading mb-6">Meet Our Team</h1>
          <p className="text-medical-subheading max-w-3xl mx-auto">
            Our dedicated team of healthcare professionals, data scientists, and technology experts 
            are committed to revolutionizing maternal healthcare through innovative solutions.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="card-medical mb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-medical-body mb-4">
              At Maternova, we combine medical expertise, data science, and cutting-edge technology 
              to create accessible, trustworthy healthcare solutions for mothers and families. 
              Our diverse team brings together years of experience in healthcare, AI, and cybersecurity 
              to ensure the highest standards of care and data protection.
            </p>
            <blockquote className="text-medical-body italic border-l-4 border-primary pl-4 mb-6">
              "We are a multidisciplinary team of 3MTT C3 Fellows from Nigeria, combining expertise in AI/ML and cybersecurity to solve maternal and child healthcare challenges"
            </blockquote>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">Healthcare Innovation</Badge>
              <Badge className="bg-accent/10 text-accent border-accent/20">Data Security</Badge>
              <Badge className="bg-secondary/10 text-secondary-foreground border-secondary/20">AI Technology</Badge>
              <Badge className="bg-success/10 text-success border-success/20">Patient Care</Badge>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="card-medical-hover overflow-hidden">
              <div className="aspect-square bg-gradient-primary/10 overflow-hidden rounded-t-lg mb-6">
                <img 
                  src={member.image} 
                  alt={`${member.name} - ${member.role}`}
                  className={`w-full h-full object-cover ${member.name === 'Osifo Goodness' ? 'object-top' : ''}`}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {member.company}
                  </p>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {member.description}
                </p>
                
                <div className="flex justify-center pt-2">
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Medical Excellence',
              description: 'Combining clinical expertise with evidence-based practices',
              icon: '🏥'
            },
            {
              title: 'Data Security',
              description: 'Protecting patient information with enterprise-grade security',
              icon: '🔒' 
            },
            {
              title: 'Innovation',
              description: 'Leveraging AI and ML to advance maternal healthcare',
              icon: '🚀'
            },
            {
              title: 'Accessibility',
              description: 'Making quality healthcare guidance available to everyone',
              icon: '🌍'
            }
          ].map((value, index) => (
            <Card key={index} className="card-medical text-center">
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="card-medical text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions about our technology, partnerships, or want to collaborate? 
            We'd love to hear from healthcare professionals, researchers, and organizations 
            working to improve maternal health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:team@maternova.health" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Our Team
            </a>
            <a 
              href="#partnerships" 
              className="inline-flex items-center justify-center px-6 py-3 border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors"
            >
              Partnership Opportunities
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Team;