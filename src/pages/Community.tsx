import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart, Search, Plus, Shield, Clock, Users } from 'lucide-react';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const communityPosts = [
    {
      id: 1,
      author: 'Sarah M.',
      role: 'Mother',
      avatar: 'SM',
      time: '2 hours ago',
      title: 'First trimester nausea - what helped you?',
      content: 'I\'m 8 weeks pregnant and struggling with morning sickness. Any natural remedies that worked for you?',
      replies: 12,
      likes: 8,
      tags: ['First Trimester', 'Morning Sickness'],
      verified: false
    },
    {
      id: 2,
      author: 'Dr. Jennifer W.',
      role: 'Verified Doctor',
      avatar: 'JW',
      time: '4 hours ago',
      title: 'Important: Iron deficiency during pregnancy',
      content: 'Iron deficiency is common during pregnancy. Here are the signs to watch for and safe ways to increase iron intake...',
      replies: 25,
      likes: 45,
      tags: ['Medical Advice', 'Nutrition'],
      verified: true
    },
    {
      id: 3,
      author: 'Emily R.',
      role: 'Mother',
      avatar: 'ER',
      time: '6 hours ago',
      title: 'Baby movement at 20 weeks - is this normal?',
      content: 'I\'ve been feeling gentle flutters for the past few days. Is this what baby kicks feel like at 20 weeks?',
      replies: 8,
      likes: 15,
      tags: ['Second Trimester', 'Baby Movement'],
      verified: false
    },
    {
      id: 4,
      author: 'Nurse Lisa K.',
      role: 'Verified Nurse',
      avatar: 'LK',
      time: '1 day ago',
      title: 'Breastfeeding preparation tips',
      content: 'Starting to think about breastfeeding? Here are some evidence-based tips to help you prepare...',
      replies: 31,
      likes: 67,
      tags: ['Breastfeeding', 'Preparation'],
      verified: true
    }
  ];

  const popularTags = [
    'First Trimester', 'Second Trimester', 'Third Trimester',
    'Morning Sickness', 'Baby Movement', 'Nutrition',
    'Exercise', 'Mental Health', 'Labor Prep'
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-medical-heading mb-4">Community Support</h1>
          <p className="text-medical-subheading max-w-2xl mx-auto">
            Connect with other mothers and verified healthcare professionals. 
            Share experiences, ask questions, and get support from our caring community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search and New Post */}
            <Card className="card-medical">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search community discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => setShowNewPost(!showNewPost)}
                  className="btn-medical-accent"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Post
                </Button>
              </div>
            </Card>

            {/* New Post Form */}
            {showNewPost && (
              <Card className="card-medical">
                <h3 className="text-lg font-semibold text-foreground mb-4">Create New Post</h3>
                <div className="space-y-4">
                  <Input placeholder="Post title..." />
                  <Textarea 
                    placeholder="Share your question or experience..."
                    className="min-h-[120px]"
                  />
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      {popularTags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNewPost(false)}>
                        Cancel
                      </Button>
                      <Button className="btn-medical-primary">
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Community Posts */}
            <div className="space-y-6">
              {communityPosts.map((post) => (
                <Card key={post.id} className="card-medical-hover">
                  <div className="flex items-start space-x-4">
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground">{post.author}</h3>
                        {post.verified && (
                          <Badge className="bg-success text-success-foreground">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified {post.role.split(' ')[1]}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.time}
                        </span>
                      </div>
                      
                      <h2 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-muted-foreground">
                        <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.replies} replies</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes} likes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Community Stats */}
            <Card className="card-medical text-center">
              <h3 className="font-semibold text-foreground mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-lg font-semibold text-success">15</p>
                  <p className="text-sm text-muted-foreground">Verified Doctors</p>
                </div>
              </div>
            </Card>

            {/* Popular Tags */}
            <Card className="card-medical">
              <h3 className="font-semibold text-foreground mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card className="card-medical">
              <h3 className="font-semibold text-foreground mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be respectful and supportive</li>
                <li>• No medical advice from unverified users</li>
                <li>• Share experiences, not diagnoses</li>
                <li>• Report inappropriate content</li>
                <li>• Always consult healthcare providers</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;