import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoiceControls } from '@/components/VoiceControls';
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, User } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Sample detailed article - in real app this would come from API/database
  const article = {
    id: 1,
    title: 'First Trimester Nutrition: Complete Guide for Rural Mothers',
    subtitle: 'Essential nutritional guidelines for the first 12 weeks of pregnancy, specially adapted for rural communities',
    category: 'First Trimester',
    readTime: '8 min read',
    author: 'Dr. Sarah Johnson',
    publishedAt: '2 days ago',
    image: 'nutrition',
    tags: ['Nutrition', 'Health', 'Safety', 'Rural Health'],
    content: [
      {
        type: 'paragraph',
        text: 'Proper nutrition during the first trimester is crucial for both mother and baby. For mothers in rural areas, accessing diverse nutrition can be challenging, but with the right knowledge, you can ensure a healthy pregnancy using locally available foods.'
      },
      {
        type: 'heading',
        text: 'Essential Nutrients in First Trimester'
      },
      {
        type: 'paragraph',
        text: 'During the first 12 weeks, your baby\'s major organs are forming. This makes it critical to get enough folic acid, iron, calcium, and protein. These nutrients can be found in many foods available in rural communities.'
      },
      {
        type: 'list',
        text: 'Key nutrients needed:\n• Folic Acid: Prevents birth defects - found in dark leafy greens, beans, fortified grains\n• Iron: Prevents anemia - found in lean meats, dried beans, spinach\n• Calcium: Builds strong bones - found in milk, yogurt, cheese, leafy greens\n• Protein: Supports growth - found in eggs, fish, poultry, beans, nuts'
      },
      {
        type: 'heading',
        text: 'Foods to Avoid'
      },
      {
        type: 'paragraph',
        text: 'Some foods can be harmful during pregnancy. Raw or undercooked meats, unpasteurized dairy products, and certain fish high in mercury should be avoided. Always cook meat thoroughly and wash fruits and vegetables carefully.'
      },
      {
        type: 'heading',
        text: 'Managing Morning Sickness'
      },
      {
        type: 'paragraph',
        text: 'Morning sickness affects many women in early pregnancy. Eating small, frequent meals can help. Ginger tea, crackers, and bland foods often provide relief. If you cannot keep food down for more than 24 hours, contact your healthcare provider.'
      },
      {
        type: 'heading',
        text: 'Local Food Options for Rural Mothers'
      },
      {
        type: 'paragraph',
        text: 'Rural communities often have access to fresh, nutritious foods. Locally grown vegetables, fruits, grains, and dairy products can provide excellent nutrition. Consider starting a small garden with pregnancy-friendly vegetables like spinach, carrots, and tomatoes.'
      },
      {
        type: 'paragraph',
        text: 'Remember, every pregnancy is unique. Always consult with your healthcare provider about your specific nutritional needs and any concerns you may have.'
      }
    ]
  };

  const fullText = article.content.map(section => section.text).join(' ');

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/articles')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>

        {/* Article Header */}
        <Card className="card-medical mb-8">
          <div className="aspect-video bg-gradient-primary rounded-lg mb-6 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary-foreground" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-medical-heading mb-3">{article.title}</h1>
          <p className="text-medical-subheading mb-6">{article.subtitle}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime}
              </div>
              <span>{article.publishedAt}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <VoiceControls 
                text={fullText}
                showSpeechToText={false}
                showTextToSpeech={true}
                className="mr-2"
              />
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                className={isSaved ? 'text-primary' : ''}
              >
                <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Article Content */}
        <Card className="card-medical">
          <div className="prose prose-lg max-w-none">
            {article.content.map((section, index) => {
              if (section.type === 'heading') {
                return (
                  <div key={index} className="mt-8 mb-4">
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      {section.text}
                    </h2>
                    <VoiceControls 
                      text={section.text}
                      showSpeechToText={false}
                      showTextToSpeech={true}
                      className="mb-4"
                    />
                  </div>
                );
              } else if (section.type === 'list') {
                return (
                  <div key={index} className="mb-6">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed">
                        {section.text}
                      </pre>
                    </div>
                    <VoiceControls 
                      text={section.text}
                      showSpeechToText={false}
                      showTextToSpeech={true}
                      className="mt-2"
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="mb-6">
                    <p className="text-foreground leading-relaxed text-base">
                      {section.text}
                    </p>
                    <VoiceControls 
                      text={section.text}
                      showSpeechToText={false}
                      showTextToSpeech={true}
                      className="mt-2"
                    />
                  </div>
                );
              }
            })}
          </div>
        </Card>

        {/* Related Articles */}
        <Card className="card-medical mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Second Trimester Nutrition Guide', category: 'Second Trimester' },
              { title: 'Managing Pregnancy Cravings', category: 'Nutrition' },
            ].map((related, index) => (
              <div key={index} className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer">
                <Badge variant="outline" className="mb-2 text-xs">{related.category}</Badge>
                <h4 className="font-medium text-foreground">{related.title}</h4>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ArticleDetail;