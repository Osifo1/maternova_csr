import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VoiceControls } from '@/components/VoiceControls';
import { Search, BookOpen, Clock, Bookmark, Filter } from 'lucide-react';

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'First Trimester', 'Second Trimester', 'Third Trimester', 'Nutrition', 'Exercise', 'Mental Health', 'Postpartum'];

  const articles = [
    {
      id: 1,
      title: 'First Trimester Nutrition: What to Eat and Avoid',
      excerpt: 'Essential nutritional guidelines for the first 12 weeks of pregnancy, including key nutrients and foods to avoid.',
      category: 'First Trimester',
      readTime: '8 min read',
      author: 'Dr. Sarah Johnson',
      publishedAt: '2 days ago',
      image: 'nutrition',
      tags: ['Nutrition', 'Health', 'Safety'],
      saved: false
    },
    {
      id: 2,
      title: 'Understanding Baby Movement Patterns',
      excerpt: 'Learn when to expect your baby\'s first movements and how patterns change throughout pregnancy.',
      category: 'Second Trimester',
      readTime: '6 min read',
      author: 'Dr. Michael Chen',
      publishedAt: '5 days ago',
      image: 'movement',
      tags: ['Baby Development', 'Monitoring'],
      saved: true
    },
    {
      id: 3,
      title: 'Safe Exercise During Pregnancy',
      excerpt: 'Guidelines for staying active during pregnancy, including recommended exercises and activities to avoid.',
      category: 'Exercise',
      readTime: '10 min read',
      author: 'Lisa Thompson, PT',
      publishedAt: '1 week ago',
      image: 'exercise',
      tags: ['Exercise', 'Fitness', 'Health'],
      saved: false
    },
    {
      id: 4,
      title: 'Managing Pregnancy Anxiety and Stress',
      excerpt: 'Practical strategies for managing anxiety and stress during pregnancy for better maternal and fetal health.',
      category: 'Mental Health',
      readTime: '12 min read',
      author: 'Dr. Emma Rodriguez',
      publishedAt: '1 week ago',
      image: 'mental-health',
      tags: ['Mental Health', 'Wellness', 'Coping'],
      saved: false
    },
    {
      id: 5,
      title: 'Preparing for Labor: Signs and Stages',
      excerpt: 'Complete guide to labor preparation, recognizing early signs, and understanding the stages of childbirth.',
      category: 'Third Trimester',
      readTime: '15 min read',
      author: 'Dr. Jennifer Williams',
      publishedAt: '2 weeks ago',
      image: 'labor',
      tags: ['Labor', 'Preparation', 'Birth'],
      saved: true
    },
    {
      id: 6,
      title: 'Postpartum Recovery: What to Expect',
      excerpt: 'Understanding the physical and emotional changes after birth and how to support your recovery.',
      category: 'Postpartum',
      readTime: '11 min read',
      author: 'Dr. Amanda Foster',
      publishedAt: '3 weeks ago',
      image: 'recovery',
      tags: ['Recovery', 'Postpartum', 'Health'],
      saved: false
    }
  ];

  const glossaryTerms = [
    { term: 'Braxton Hicks', definition: 'Practice contractions that prepare the body for labor' },
    { term: 'Quickening', definition: 'The first fetal movements felt by the mother' },
    { term: 'Fundal Height', definition: 'Measurement from pubic bone to top of uterus' },
    { term: 'Vernix', definition: 'Waxy coating that protects baby\'s skin in the womb' },
    { term: 'Colostrum', definition: 'First form of breast milk, rich in antibodies' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-medical-heading mb-4">Health Articles & Resources</h1>
          <p className="text-medical-subheading max-w-2xl mx-auto">
            Expert-reviewed articles, guides, and resources to support you throughout your pregnancy journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Search */}
            <Card className="card-medical">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Categories */}
            <Card className="card-medical">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Glossary */}
            <Card className="card-medical">
              <h3 className="font-semibold text-foreground mb-4">Quick Glossary</h3>
              <div className="space-y-3">
                {glossaryTerms.map((item, index) => (
                  <div key={index} className="border-b border-border pb-2 last:border-b-0">
                    <h4 className="text-sm font-medium text-foreground">{item.term}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.definition}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Full Glossary
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredArticles.length} articles
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Articles
              </Button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="card-medical-hover overflow-hidden">
                  <div className="aspect-video bg-gradient-primary rounded-t-lg mb-4 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <button 
                        className={`p-1 rounded ${
                          article.saved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" fill={article.saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-foreground line-clamp-2 hover:text-primary cursor-pointer"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <VoiceControls 
                      text={`${article.title}. ${article.excerpt}`}
                      showSpeechToText={false}
                      showTextToSpeech={true}
                      className="mt-2"
                    />
                    
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        <p>{article.author}</p>
                        <p>{article.publishedAt}</p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-medical-primary"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      Read Article
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>

            {/* Featured Section */}
            <Card className="card-medical mt-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">Want Personalized Content?</h3>
                <p className="text-muted-foreground mb-4">
                  Get articles and tips tailored to your pregnancy stage and interests.
                </p>
                <Button className="btn-medical-accent">
                  Create Your Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;