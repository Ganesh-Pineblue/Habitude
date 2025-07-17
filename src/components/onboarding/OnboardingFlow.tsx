import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, ArrowRight, ArrowLeft, Sparkles, User, CheckCircle, Search, Loader2, Zap } from 'lucide-react';
import { FriendlyChatbotLogo } from '../common/FriendlyChatbotLogo';
import { onboardingService } from '../../services/OnboardingService';

interface OnboardingFlowProps {
  onComplete: (personalityProfile: any) => void;
  onBack: () => void;
  user: { name: string; email: string; id?: number };
}

interface PersonalInfo {
  firstName: string;
  generation: string;
  gender: string;
  customGender: string;
}

interface PersonalitySelection {
  selectedPersonality: string;
  selectedHabits: string[];
}

interface PersonalityData {
  name: string;
  category: string;
  habits: string[];
  image: string;
  description?: string;
  achievements?: string[];
}

const generations = [
  { value: 'gen-alpha', label: 'Gen Alpha (2013–2025)', emoji: '🍼' },
  { value: 'gen-z', label: 'Gen Z (1997–2012)', emoji: '👶' },
  { value: 'millennial', label: 'Millennial (1981–1996)', emoji: '🧑‍💻' },
  { value: 'gen-x', label: 'Gen X (1965–1980)', emoji: '👔' },
  { value: 'boomer', label: 'Boomer (1946–1964)', emoji: '🕺' }
];

const genderOptions = [
  { value: 'mr', label: 'Mr.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'mx', label: 'Mx. (Gender-neutral)' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'custom', label: 'Custom' }
];

const famousPersonalities = [
  { 
    name: 'Steve Jobs', 
    category: 'Tech Visionary',
    habits: ['Daily meditation', 'Minimalist workspace', 'Walking meetings', 'Focus on one project', 'Early morning routine', 'Reading biographies', 'Perfectionist mindset', 'Healthy eating', 'Regular exercise', 'Deep work sessions'],
    image: '/images/steve.webp'
  },
  { 
    name: 'Oprah Winfrey', 
    category: 'Media Mogul',
    habits: ['Daily gratitude practice', 'Morning journaling', 'Regular reading', 'Mindful eating', 'Exercise routine', 'Helping others', 'Positive affirmations', 'Quality sleep', 'Learning new things', 'Building relationships'],
    image: '/images/oprah.webp'
  },
  { 
    name: 'Elon Musk', 
    category: 'Entrepreneur',
    habits: ['Reading extensively', 'Working long hours', 'Problem-solving focus', 'Taking calculated risks', 'Continuous learning', 'Physical exercise', 'Healthy diet', 'Goal setting', 'Innovation mindset', 'Time blocking'],
    image: '/images/musk.jpg'
  },
  { 
    name: 'Michelle Obama', 
    category: 'Leader & Author',
    habits: ['Morning workouts', 'Family time priority', 'Healthy eating', 'Community service', 'Continuous education', 'Public speaking', 'Writing daily', 'Self-care routine', 'Mentoring others', 'Work-life balance'],
    image: '/images/mother.webp'
  },
  { 
    name: 'Warren Buffett', 
    category: 'Investor',
    habits: ['Reading 5 hours daily', 'Long-term thinking', 'Simple living', 'Playing bridge', 'Annual letters', 'Value investing', 'Patience practice', 'Learning from mistakes', 'Staying curious', 'Giving back'],
    image: '/images/gates.webp'
  },
  { 
    name: 'Bill Gates', 
    category: 'Philanthropist',
    habits: ['Reading 50 books/year', 'Think weeks', 'Learning continuously', 'Problem-solving', 'Giving to charity', 'Time management', 'Healthy lifestyle', 'Innovation focus', 'Global awareness', 'Technology adoption'],
    image: '/images/gates.webp'
  },
  { 
    name: 'Albert Einstein',
    category: 'Scientist',
    habits: ['Deep thinking sessions', 'Questioning assumptions', 'Imagination exercises', 'Mathematical practice', 'Reading philosophy', 'Playing violin', 'Walking for inspiration', 'Simple living', 'Curiosity cultivation', 'Independent thinking'],
    image: '/images/Einstein.webp'
  },
  { 
    name: 'Mahatma Gandhi',
    category: 'Leader',
    habits: ['Daily prayer and meditation', 'Fasting for discipline', 'Non-violent communication', 'Simple living', 'Walking daily', 'Reading religious texts', 'Spinning cotton', 'Truth and honesty', 'Service to others', 'Self-reflection'],
    image: '/images/Gandhi.webp'
  },
  { 
    name: 'Nelson Mandela',
    category: 'Leader',
    habits: ['Early morning exercise', 'Reading and education', 'Forgiveness practice', 'Unity building', 'Listening to others', 'Staying positive', 'Leading by example', 'Persistence in goals', 'Respect for all people', 'Hope and optimism'],
    image: '/images/mandela.webp'
  }
];

// AI Personality Search Service
class AIPersonalityService {
  private static instance: AIPersonalityService;
  
  static getInstance(): AIPersonalityService {
    if (!AIPersonalityService.instance) {
      AIPersonalityService.instance = new AIPersonalityService();
    }
    return AIPersonalityService.instance;
  }

  // Mock AI API call to search for personalities
  async searchPersonality(query: string): Promise<PersonalityData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Special handling for well-known personalities
    const specialPersonalities: { [key: string]: PersonalityData } = {
      'narendra modi': {
        name: 'Narendra Modi',
        category: 'Political Leader',
        habits: [
          'Early morning yoga and meditation',
          'Reading policy documents',
          'Daily exercise routine',
          'Public speaking practice',
          'Meeting with cabinet ministers',
          'Strategic planning sessions',
          'International diplomacy',
          'Community engagement',
          'Digital governance focus',
          'Work-life discipline'
        ],
        image: '/images/mandela.webp', // Using available image
        description: 'Prime Minister of India known for his disciplined lifestyle and transformative leadership.',
        achievements: ['Digital India initiative', 'International diplomacy', 'Economic reforms']
      },
      'cristiano ronaldo': {
        name: 'Cristiano Ronaldo',
        category: 'Sports Champion',
        habits: [
          'Intensive training sessions',
          'Strict nutrition planning',
          'Mental preparation',
          'Recovery protocols',
          'Skill development',
          'Team collaboration',
          'Goal setting',
          'Performance analysis',
          'Discipline maintenance',
          'Competition focus'
        ],
        image: '/images/musk.jpg', // Using available image
        description: 'Professional footballer known for his exceptional work ethic and dedication to fitness.',
        achievements: ['Multiple championships', 'Record breaking', 'Sports excellence']
      },
      'elon musk': {
        name: 'Elon Musk',
        category: 'Technology Innovator',
        habits: [
          'Reading extensively',
          'Working long hours',
          'Problem-solving focus',
          'Taking calculated risks',
          'Continuous learning',
          'Physical exercise',
          'Healthy diet',
          'Goal setting',
          'Innovation mindset',
          'Time blocking'
        ],
        image: '/images/musk.jpg',
        description: 'Entrepreneur and innovator known for revolutionizing multiple industries.',
        achievements: ['Tesla success', 'SpaceX achievements', 'Industry disruption']
      }
    };
    
    // Check for special personalities first
    for (const [key, personality] of Object.entries(specialPersonalities)) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        return [personality];
      }
    }
    
    // If it's one of our predefined personalities, return it
    const predefinedMatch = famousPersonalities.find(p => 
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery)
    );
    
    if (predefinedMatch) {
      return [predefinedMatch];
    }
    
    // Generate AI-powered personality data based on search query
    return this.generateAIPersonality(normalizedQuery);
  }

  private generateAIPersonality(query: string): PersonalityData[] {
    // AI-generated personality categories and habits based on search query
    const personalityTemplates = [
      {
        category: 'Political Leader',
        habits: [
          'Early morning briefings',
          'Daily exercise routine',
          'Reading policy documents',
          'Public speaking practice',
          'Meeting with advisors',
          'Strategic planning sessions',
          'International diplomacy',
          'Community engagement',
          'Continuous learning',
          'Work-life balance maintenance'
        ],
        achievements: ['Led major policy reforms', 'International recognition', 'Public service excellence']
      },
      {
        category: 'Business Leader',
        habits: [
          'Strategic thinking sessions',
          'Team building activities',
          'Market analysis',
          'Innovation workshops',
          'Networking events',
          'Financial planning',
          'Leadership development',
          'Customer focus',
          'Risk management',
          'Continuous improvement'
        ],
        achievements: ['Built successful companies', 'Industry leadership', 'Innovation awards']
      },
      {
        category: 'Sports Champion',
        habits: [
          'Intensive training sessions',
          'Mental preparation',
          'Nutrition planning',
          'Recovery protocols',
          'Skill development',
          'Team collaboration',
          'Goal setting',
          'Performance analysis',
          'Discipline maintenance',
          'Competition focus'
        ],
        achievements: ['Championship victories', 'Record breaking', 'Sports excellence']
      },
      {
        category: 'Artist/Creator',
        habits: [
          'Creative inspiration time',
          'Skill practice sessions',
          'Portfolio development',
          'Collaboration projects',
          'Market research',
          'Self-expression',
          'Innovation exploration',
          'Audience engagement',
          'Continuous learning',
          'Work-life harmony'
        ],
        achievements: ['Award-winning creations', 'Cultural impact', 'Creative excellence']
      },
      {
        category: 'Scientist/Researcher',
        habits: [
          'Research methodology',
          'Data analysis',
          'Literature review',
          'Experiment design',
          'Collaboration with peers',
          'Publication writing',
          'Conference presentations',
          'Grant applications',
          'Continuous learning',
          'Innovation focus'
        ],
        achievements: ['Breakthrough discoveries', 'Research publications', 'Scientific recognition']
      },
      {
        category: 'Educator/Mentor',
        habits: [
          'Lesson planning',
          'Student engagement',
          'Continuous learning',
          'Mentorship sessions',
          'Curriculum development',
          'Assessment methods',
          'Professional development',
          'Community involvement',
          'Innovation in teaching',
          'Lifelong learning'
        ],
        achievements: ['Educational excellence', 'Student success', 'Teaching innovation']
      },
      {
        category: 'Technology Innovator',
        habits: [
          'Coding practice sessions',
          'Problem-solving exercises',
          'Technology research',
          'Innovation brainstorming',
          'Collaboration with developers',
          'Product development',
          'User experience focus',
          'Continuous learning',
          'Industry networking',
          'Future technology exploration'
        ],
        achievements: ['Revolutionary products', 'Technology breakthroughs', 'Industry disruption']
      },
      {
        category: 'Healthcare Professional',
        habits: [
          'Patient care focus',
          'Medical research',
          'Continuous education',
          'Team collaboration',
          'Evidence-based practice',
          'Health advocacy',
          'Professional development',
          'Work-life balance',
          'Stress management',
          'Compassionate care'
        ],
        achievements: ['Patient outcomes improvement', 'Medical innovations', 'Healthcare leadership']
      },
      {
        category: 'Environmental Advocate',
        habits: [
          'Environmental research',
          'Sustainability practices',
          'Community outreach',
          'Policy advocacy',
          'Green technology focus',
          'Conservation efforts',
          'Public education',
          'Collaboration with organizations',
          'Innovation in sustainability',
          'Global awareness'
        ],
        achievements: ['Environmental impact', 'Policy changes', 'Community transformation']
      },
      {
        category: 'Social Entrepreneur',
        habits: [
          'Social impact measurement',
          'Community engagement',
          'Innovation in solutions',
          'Partnership building',
          'Resource mobilization',
          'Impact assessment',
          'Stakeholder collaboration',
          'Sustainable business models',
          'Social justice focus',
          'Continuous learning'
        ],
        achievements: ['Social impact creation', 'Community transformation', 'Innovation awards']
      }
    ];

    // Determine category based on query keywords
    let selectedTemplate = personalityTemplates[0]; // Default to Political Leader
    
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('business') || queryLower.includes('entrepreneur') || queryLower.includes('ceo') || queryLower.includes('founder') || queryLower.includes('startup')) {
      selectedTemplate = personalityTemplates[1];
    } else if (queryLower.includes('sport') || queryLower.includes('athlete') || queryLower.includes('champion') || queryLower.includes('player') || queryLower.includes('football') || queryLower.includes('cricket') || queryLower.includes('tennis')) {
      selectedTemplate = personalityTemplates[2];
    } else if (queryLower.includes('artist') || queryLower.includes('creator') || queryLower.includes('designer') || queryLower.includes('musician') || queryLower.includes('painter') || queryLower.includes('writer')) {
      selectedTemplate = personalityTemplates[3];
    } else if (queryLower.includes('scientist') || queryLower.includes('researcher') || queryLower.includes('doctor') || queryLower.includes('professor') || queryLower.includes('phd') || queryLower.includes('research')) {
      selectedTemplate = personalityTemplates[4];
    } else if (queryLower.includes('teacher') || queryLower.includes('educator') || queryLower.includes('mentor') || queryLower.includes('professor') || queryLower.includes('education')) {
      selectedTemplate = personalityTemplates[5];
    } else if (queryLower.includes('tech') || queryLower.includes('programmer') || queryLower.includes('developer') || queryLower.includes('engineer') || queryLower.includes('software') || queryLower.includes('ai') || queryLower.includes('artificial intelligence')) {
      selectedTemplate = personalityTemplates[6];
    } else if (queryLower.includes('doctor') || queryLower.includes('nurse') || queryLower.includes('healthcare') || queryLower.includes('medical') || queryLower.includes('surgeon') || queryLower.includes('physician')) {
      selectedTemplate = personalityTemplates[7];
    } else if (queryLower.includes('environment') || queryLower.includes('climate') || queryLower.includes('sustainability') || queryLower.includes('green') || queryLower.includes('conservation')) {
      selectedTemplate = personalityTemplates[8];
    } else if (queryLower.includes('social') || queryLower.includes('nonprofit') || queryLower.includes('ngo') || queryLower.includes('charity') || queryLower.includes('activist')) {
      selectedTemplate = personalityTemplates[9];
    }

    // Generate personality name and description
    const name = this.generatePersonalityName(query);
    const description = this.generatePersonalityDescription(name, selectedTemplate.category);

    return [{
      name,
      category: selectedTemplate.category,
      habits: selectedTemplate.habits,
      image: this.generatePersonalityImage(),
      description,
      achievements: selectedTemplate.achievements
    }];
  }

  private generatePersonalityName(query: string): string {
    // Extract potential name from query or generate one
    const words = query.split(' ');
    const potentialName = words.find(word => 
      word.length > 2 && 
      word[0] === word[0].toUpperCase() && 
      !['The', 'And', 'Or', 'But', 'For', 'With', 'From', 'Into', 'During', 'Including', 'Until', 'Against', 'Among', 'Throughout', 'Despites', 'Towards', 'Upon', 'Concerning', 'To', 'In', 'For', 'Of', 'With', 'By'].includes(word)
    );
    
    // Check for full names (two capitalized words)
    const capitalizedWords = words.filter(word => 
      word.length > 1 && 
      word[0] === word[0].toUpperCase() && 
      !['The', 'And', 'Or', 'But', 'For', 'With', 'From', 'Into', 'During', 'Including', 'Until', 'Against', 'Among', 'Throughout', 'Despites', 'Towards', 'Upon', 'Concerning', 'To', 'In', 'For', 'Of', 'With', 'By'].includes(word)
    );
    
    if (capitalizedWords.length >= 2) {
      // Return first two capitalized words as full name
      return `${capitalizedWords[0]} ${capitalizedWords[1]}`;
    } else if (potentialName) {
      return potentialName;
    }
    
    // Generate a name based on the query
    const nameGenerators = [
      'Dr. ' + query.charAt(0).toUpperCase() + query.slice(1) + ' Kumar',
      'Prof. ' + query.charAt(0).toUpperCase() + query.slice(1) + ' Singh',
      query.charAt(0).toUpperCase() + query.slice(1) + ' Sharma',
      'Mr. ' + query.charAt(0).toUpperCase() + query.slice(1) + ' Patel',
      query.charAt(0).toUpperCase() + query.slice(1) + ' Verma',
      'Ms. ' + query.charAt(0).toUpperCase() + query.slice(1) + ' Gupta',
      query.charAt(0).toUpperCase() + query.slice(1) + ' Reddy',
      'Dr. ' + query.charAt(0).toUpperCase() + query.slice(1) + ' Iyer'
    ];
    
    return nameGenerators[Math.floor(Math.random() * nameGenerators.length)];
  }

  private generatePersonalityDescription(name: string, category: string): string {
    const descriptions = [
      `${name} is a renowned ${category.toLowerCase()} known for their exceptional leadership and innovative approach.`,
      `As a distinguished ${category.toLowerCase()}, ${name} has made significant contributions to their field.`,
      `${name} stands out as an influential ${category.toLowerCase()} with a proven track record of success.`,
      `Recognized globally as a leading ${category.toLowerCase()}, ${name} continues to inspire others.`,
      `${name} exemplifies excellence in ${category.toLowerCase()} through dedication and hard work.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generatePersonalityImage(): string {
    // Use a placeholder image service or return a default
    const imageOptions = [
      '/images/steve.webp',
      '/images/oprah.webp',
      '/images/musk.jpg',
      '/images/mother.webp',
      '/images/gates.webp',
      '/images/Einstein.webp',
      '/images/Gandhi.webp',
      '/images/mandela.webp'
    ];
    
    return imageOptions[Math.floor(Math.random() * imageOptions.length)];
  }
}

// AI Goal Generation Service
class AIGoalGenerationService {
  private static instance: AIGoalGenerationService;
  
  static getInstance(): AIGoalGenerationService {
    if (!AIGoalGenerationService.instance) {
      AIGoalGenerationService.instance = new AIGoalGenerationService();
    }
    return AIGoalGenerationService.instance;
  }

  // Generate AI-powered goals based on selected habits - creating complementary goals, not duplicates
  generateGoalsFromHabits(selectedHabits: string[]): any[] {
    // Analyze the selected habits to understand the user's focus areas
    const habitCategories = this.analyzeHabitCategories(selectedHabits);
    
    // Generate complementary goals based on the habit categories
    const complementaryGoals = this.generateComplementaryGoals(habitCategories);
    
    // Select the best 3-5 goals (not one per habit)
    const selectedGoals = this.selectBestGoals(complementaryGoals, selectedHabits.length);
    
    return selectedGoals;
  }

  private analyzeHabitCategories(selectedHabits: string[]): { [category: string]: number } {
    const categories: { [category: string]: number } = {
      'health': 0,
      'productivity': 0,
      'mindfulness': 0,
      'social': 0,
      'fitness': 0
    };

    selectedHabits.forEach(habit => {
      const lowerHabit = habit.toLowerCase();
      
      if (lowerHabit.includes('meditation') || lowerHabit.includes('gratitude') || lowerHabit.includes('journal') || lowerHabit.includes('prayer')) {
        categories.mindfulness++;
      } else if (lowerHabit.includes('exercise') || lowerHabit.includes('walking') || lowerHabit.includes('running') || lowerHabit.includes('workout')) {
        categories.fitness++;
        categories.health++;
      } else if (lowerHabit.includes('reading') || lowerHabit.includes('learning') || lowerHabit.includes('study') || lowerHabit.includes('goal')) {
        categories.productivity++;
      } else if (lowerHabit.includes('help') || lowerHabit.includes('kindness') || lowerHabit.includes('social')) {
        categories.social++;
      } else if (lowerHabit.includes('water') || lowerHabit.includes('sleep') || lowerHabit.includes('eating') || lowerHabit.includes('health')) {
        categories.health++;
      } else {
        // Default categorization
        categories.productivity++;
      }
    });

    return categories;
  }

  private generateComplementaryGoals(habitCategories: { [category: string]: number }): any[] {
    const allGoals: any[] = [];
    
    // Health-focused complementary goals
    if (habitCategories.health > 0 || habitCategories.fitness > 0) {
      allGoals.push(
        {
          title: 'Complete a 30-Day Fitness Challenge',
          description: 'Take your fitness to the next level with a structured challenge that builds on your daily exercise habit',
          target: 30,
          current: 0,
          unit: 'days',
          deadline: this.getFutureDate(45),
          category: 'fitness' as const,
          priority: 'high' as const,
          complementaryTo: 'health/fitness habits'
        },
        {
          title: 'Achieve 10,000 Steps Daily for 21 Days',
          description: 'Build on your walking habit by maintaining a consistent step count every day',
          target: 21,
          current: 0,
          unit: 'days',
          deadline: this.getFutureDate(30),
          category: 'health' as const,
          priority: 'medium' as const,
          complementaryTo: 'walking/exercise habits'
        },
        {
          title: 'Complete 3 Different Types of Workouts',
          description: 'Expand your exercise routine by trying strength training, cardio, and flexibility workouts',
          target: 3,
          current: 0,
          unit: 'workout types',
          deadline: this.getFutureDate(60),
          category: 'fitness' as const,
          priority: 'medium' as const,
          complementaryTo: 'exercise habits'
        },
        {
          title: 'Improve Sleep Quality Score to 85+',
          description: 'Track and improve your sleep quality using a sleep tracking app',
          target: 85,
          current: 0,
          unit: 'sleep score',
          deadline: this.getFutureDate(90),
          category: 'health' as const,
          priority: 'high' as const,
          complementaryTo: 'health habits'
        },
        {
          title: 'Complete a 5K Run',
          description: 'Train for and complete your first 5K race to challenge your fitness level',
          target: 1,
          current: 0,
          unit: 'races',
          deadline: this.getFutureDate(120),
          category: 'fitness' as const,
          priority: 'medium' as const,
          complementaryTo: 'exercise habits'
        }
      );
    }

    // Mindfulness-focused complementary goals
    if (habitCategories.mindfulness > 0) {
      allGoals.push(
        {
          title: 'Complete a 7-Day Digital Detox',
          description: 'Take a break from screens to enhance your mindfulness practice and mental clarity',
          target: 7,
          current: 0,
          unit: 'days',
          deadline: this.getFutureDate(30),
          category: 'mindfulness' as const,
          priority: 'medium' as const,
          complementaryTo: 'meditation/mindfulness habits'
        },
        {
          title: 'Learn and Practice 3 New Breathing Techniques',
          description: 'Expand your mindfulness toolkit with different breathing exercises',
          target: 3,
          current: 0,
          unit: 'techniques',
          deadline: this.getFutureDate(60),
          category: 'mindfulness' as const,
          priority: 'medium' as const,
          complementaryTo: 'meditation habits'
        },
        {
          title: 'Write 50 Gratitude Letters',
          description: 'Express gratitude to people who have positively impacted your life',
          target: 50,
          current: 0,
          unit: 'letters',
          deadline: this.getFutureDate(180),
          category: 'mindfulness' as const,
          priority: 'medium' as const,
          complementaryTo: 'gratitude habits'
        },
        {
          title: 'Complete a Mindfulness Course',
          description: 'Deepen your understanding of mindfulness through a structured course',
          target: 1,
          current: 0,
          unit: 'courses',
          deadline: this.getFutureDate(90),
          category: 'mindfulness' as const,
          priority: 'high' as const,
          complementaryTo: 'meditation/mindfulness habits'
        },
        {
          title: 'Practice Mindful Eating for 30 Days',
          description: 'Apply mindfulness to your eating habits for better health and awareness',
          target: 30,
          current: 0,
          unit: 'days',
          deadline: this.getFutureDate(45),
          category: 'mindfulness' as const,
          priority: 'medium' as const,
          complementaryTo: 'mindfulness habits'
        }
      );
    }

    // Productivity-focused complementary goals
    if (habitCategories.productivity > 0) {
      allGoals.push(
        {
          title: 'Read 12 Books This Year',
          description: 'Expand your knowledge and vocabulary through diverse reading',
          target: 12,
          current: 0,
          unit: 'books',
          deadline: this.getFutureDate(365),
          category: 'productivity' as const,
          priority: 'medium' as const,
          complementaryTo: 'reading/learning habits'
        },
        {
          title: 'Complete 3 Online Courses',
          description: 'Develop new skills through structured online learning',
          target: 3,
          current: 0,
          unit: 'courses',
          deadline: this.getFutureDate(180),
          category: 'productivity' as const,
          priority: 'high' as const,
          complementaryTo: 'learning habits'
        },
        {
          title: 'Learn a New Language - Basic Proficiency',
          description: 'Achieve basic conversational skills in a new language',
          target: 1,
          current: 0,
          unit: 'languages',
          deadline: this.getFutureDate(365),
          category: 'productivity' as const,
          priority: 'medium' as const,
          complementaryTo: 'learning habits'
        },
        {
          title: 'Write 30 Blog Posts or Articles',
          description: 'Share your knowledge and improve your writing skills',
          target: 30,
          current: 0,
          unit: 'posts',
          deadline: this.getFutureDate(180),
          category: 'productivity' as const,
          priority: 'medium' as const,
          complementaryTo: 'productivity habits'
        },
        {
          title: 'Master 5 New Skills',
          description: 'Learn and become proficient in 5 different skills or hobbies',
          target: 5,
          current: 0,
          unit: 'skills',
          deadline: this.getFutureDate(365),
          category: 'productivity' as const,
          priority: 'high' as const,
          complementaryTo: 'learning habits'
        }
      );
    }

    // Social-focused complementary goals
    if (habitCategories.social > 0) {
      allGoals.push(
        {
          title: 'Volunteer 50 Hours This Year',
          description: 'Give back to your community through regular volunteer work',
          target: 50,
          current: 0,
          unit: 'hours',
          deadline: this.getFutureDate(365),
          category: 'social' as const,
          priority: 'medium' as const,
          complementaryTo: 'helping/kindness habits'
        },
        {
          title: 'Reconnect with 10 Old Friends',
          description: 'Reach out and rebuild connections with people from your past',
          target: 10,
          current: 0,
          unit: 'friends',
          deadline: this.getFutureDate(90),
          category: 'social' as const,
          priority: 'medium' as const,
          complementaryTo: 'social habits'
        },
        {
          title: 'Join 3 New Social Groups or Clubs',
          description: 'Expand your social network by joining new communities',
          target: 3,
          current: 0,
          unit: 'groups',
          deadline: this.getFutureDate(120),
          category: 'social' as const,
          priority: 'medium' as const,
          complementaryTo: 'social habits'
        },
        {
          title: 'Organize 5 Community Events',
          description: 'Take initiative to bring people together through events',
          target: 5,
          current: 0,
          unit: 'events',
          deadline: this.getFutureDate(180),
          category: 'social' as const,
          priority: 'medium' as const,
          complementaryTo: 'helping/kindness habits'
        },
        {
          title: 'Mentor Someone for 6 Months',
          description: 'Share your knowledge and experience by mentoring another person',
          target: 6,
          current: 0,
          unit: 'months',
          deadline: this.getFutureDate(180),
          category: 'social' as const,
          priority: 'high' as const,
          complementaryTo: 'helping habits'
        }
      );
    }

    // Cross-category goals that complement multiple habit types
    allGoals.push(
      {
        title: 'Complete a Personal Development Challenge',
        description: 'Take on a 90-day challenge that combines multiple areas of improvement',
        target: 90,
        current: 0,
        unit: 'days',
        deadline: this.getFutureDate(120),
        category: 'productivity' as const,
        priority: 'high' as const,
        complementaryTo: 'multiple habit areas'
      },
      {
        title: 'Create a Morning Routine Mastery',
        description: 'Design and perfect a comprehensive morning routine that sets you up for success',
        target: 30,
        current: 0,
        unit: 'days',
        deadline: this.getFutureDate(45),
        category: 'productivity' as const,
        priority: 'high' as const,
        complementaryTo: 'morning habits'
      },
      {
        title: 'Achieve Work-Life Balance Score of 8/10',
        description: 'Improve your work-life balance through better time management and boundaries',
        target: 8,
        current: 0,
        unit: 'score',
        deadline: this.getFutureDate(90),
        category: 'productivity' as const,
        priority: 'high' as const,
        complementaryTo: 'productivity habits'
      },
      {
        title: 'Build a 30-Day Habit Streak',
        description: 'Maintain consistency in your most important habit for 30 consecutive days',
        target: 30,
        current: 0,
        unit: 'days',
        deadline: this.getFutureDate(45),
        category: 'productivity' as const,
        priority: 'high' as const,
        complementaryTo: 'multiple habit areas'
      },
      {
        title: 'Complete a Digital Detox Challenge',
        description: 'Reduce screen time and improve focus through a structured digital detox program',
        target: 7,
        current: 0,
        unit: 'days',
        deadline: this.getFutureDate(30),
        category: 'mindfulness' as const,
        priority: 'medium' as const,
        complementaryTo: 'mindfulness habits'
      },
      {
        title: 'Learn and Practice 3 Stress Management Techniques',
        description: 'Master different stress management methods for better mental health',
        target: 3,
        current: 0,
        unit: 'techniques',
        deadline: this.getFutureDate(60),
        category: 'mindfulness' as const,
        priority: 'high' as const,
        complementaryTo: 'mindfulness habits'
      },
      {
        title: 'Create a Personal Mission Statement',
        description: 'Define your life purpose and values through a structured reflection process',
        target: 1,
        current: 0,
        unit: 'mission statement',
        deadline: this.getFutureDate(30),
        category: 'productivity' as const,
        priority: 'high' as const,
        complementaryTo: 'multiple habit areas'
      },
      {
        title: 'Establish a Weekly Review System',
        description: 'Create a consistent system for reviewing progress and planning ahead',
        target: 12,
        current: 0,
        unit: 'weeks',
        deadline: this.getFutureDate(90),
        category: 'productivity' as const,
        priority: 'medium' as const,
        complementaryTo: 'productivity habits'
      }
    );

    return allGoals;
  }

  private selectBestGoals(allGoals: any[], numberOfHabits: number): any[] {
    // Select 3-5 goals based on the number of habits selected
    const targetGoalCount = Math.min(Math.max(3, numberOfHabits - 1), 5);
    
    // Score each goal based on multiple criteria
    const scoredGoals = allGoals.map(goal => {
      let score = 0;
      
      // Priority scoring (high priority goals get higher scores)
      if (goal.priority === 'high') score += 30;
      else if (goal.priority === 'medium') score += 20;
      else score += 10;
      
      // Category diversity scoring (prefer different categories)
      const categoryScore = this.getCategoryScore(goal.category);
      score += categoryScore;
      
      // Goal complexity scoring (prefer achievable but challenging goals)
      const complexityScore = this.getComplexityScore(goal);
      score += complexityScore;
      
      // Deadline scoring (prefer goals with reasonable deadlines)
      const deadlineScore = this.getDeadlineScore(goal.deadline);
      score += deadlineScore;
      
      // Cross-category goals get bonus points (they complement multiple habit areas)
      if (goal.complementaryTo === 'multiple habit areas') {
        score += 15;
      }
      
      // Morning routine goals get bonus points (foundational)
      if (goal.title.toLowerCase().includes('morning') || goal.title.toLowerCase().includes('routine')) {
        score += 10;
      }
      
      // Personal development goals get bonus points
      if (goal.title.toLowerCase().includes('personal development') || goal.title.toLowerCase().includes('challenge')) {
        score += 12;
      }
      
      return { ...goal, score };
    });
    
    // Sort by score (highest first) and select the best goals
    const sortedGoals = scoredGoals.sort((a, b) => b.score - a.score);
    const selected = sortedGoals.slice(0, targetGoalCount);
    
    // Add IDs and metadata to the selected goals
    return selected.map((goal, index) => ({
      ...goal,
      id: Date.now().toString() + index.toString() + Math.random().toString(36).substr(2, 9),
      aiGenerated: true,
      personalityInspiration: 'Based on your selected habits',
      createdAt: new Date().toISOString()
    }));
  }

  private getCategoryScore(category: string): number {
    // Different categories get different base scores
    const categoryScores: { [key: string]: number } = {
      'health': 25,      // High priority for overall wellbeing
      'fitness': 25,     // High priority for physical health
      'productivity': 20, // Important for personal growth
      'mindfulness': 18,  // Good for mental health
      'social': 15       // Important but can be built later
    };
    
    return categoryScores[category] || 10;
  }

  private getComplexityScore(goal: any): number {
    // Prefer goals that are challenging but achievable
    const target = goal.target;
    const unit = goal.unit.toLowerCase();
    
    // Score based on goal complexity and achievability
    if (unit.includes('days') || unit.includes('day')) {
      if (target <= 30) return 20;      // Short-term, achievable
      else if (target <= 90) return 25; // Medium-term, good balance
      else return 15;                   // Long-term, might be overwhelming
    } else if (unit.includes('books')) {
      if (target <= 12) return 20;      // Reasonable reading goal
      else return 15;                   // Ambitious reading goal
    } else if (unit.includes('hours')) {
      if (target <= 50) return 20;      // Manageable volunteer hours
      else return 15;                   // Ambitious volunteer goal
    } else if (unit.includes('courses') || unit.includes('skills')) {
      if (target <= 3) return 20;       // Reasonable learning goal
      else return 15;                   // Ambitious learning goal
    } else if (unit.includes('workout') || unit.includes('races')) {
      return 22;                        // Good fitness goals
    } else if (unit.includes('score')) {
      return 18;                        // Measurement-based goals
    } else {
      return 15;                        // Default score
    }
  }

  private getDeadlineScore(deadline: string): number {
    const daysUntilDeadline = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    // Prefer goals with reasonable deadlines (30-180 days)
    if (daysUntilDeadline >= 30 && daysUntilDeadline <= 180) {
      return 20; // Optimal deadline range
    } else if (daysUntilDeadline >= 15 && daysUntilDeadline <= 365) {
      return 15; // Acceptable deadline range
    } else if (daysUntilDeadline < 15) {
      return 5;  // Too soon, might be stressful
    } else {
      return 10; // Too far, might lose motivation
    }
  }

  private getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}

// Habit Conversion Service
class HabitConversionService {
  private static instance: HabitConversionService;
  
  static getInstance(): HabitConversionService {
    if (!HabitConversionService.instance) {
      HabitConversionService.instance = new HabitConversionService();
    }
    return HabitConversionService.instance;
  }

  // Convert selected habits to proper habit objects
  convertHabitsToObjects(selectedHabits: string[], personalityName: string): any[] {
    const habitObjects: any[] = [];
    
    // Map habits to proper habit objects
    const habitMapping: { [key: string]: any } = {
      'Daily meditation': {
        title: 'Daily Meditation',
        description: '10 minutes of mindfulness to start the day with clarity',
        category: 'mindfulness' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Choose a time when you\'re least likely to be interrupted. Morning or evening works great!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Exercise': {
        title: 'Daily Exercise',
        description: '30 minutes of physical activity for health and energy',
        category: 'health' as const,
        weeklyTarget: 5,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Pick a time that fits your schedule. Consistency matters more than the specific time!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Reading': {
        title: 'Daily Reading',
        description: 'Read for 30 minutes to expand knowledge and vocabulary',
        category: 'productivity' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Find a quiet time that works for you. Many people enjoy reading before bed!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Healthy eating': {
        title: 'Healthy Eating',
        description: 'Make nutritious food choices throughout the day',
        category: 'health' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Focus on making healthy choices throughout the day rather than specific meal times.',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Morning routine': {
        title: 'Morning Routine',
        description: 'Start each day with a structured morning routine',
        category: 'productivity' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Choose a time that gives you enough buffer before your day starts.',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Evening journal': {
        title: 'Evening Journal',
        description: 'Reflect on the day and plan tomorrow',
        category: 'mindfulness' as const,
        weeklyTarget: 5,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Pick a time when you can reflect without distractions. Evening works well for most people!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'weekly' as const,
          daysOfWeek: [1, 2, 3, 4, 5],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Walking': {
        title: 'Daily Walking',
        description: 'Walk 10,000 steps for cardiovascular health',
        category: 'health' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Find a time that fits your schedule. You can break it into smaller walks throughout the day!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Learning': {
        title: 'Continuous Learning',
        description: 'Spend 30 minutes learning something new',
        category: 'productivity' as const,
        weeklyTarget: 5,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Choose a time when you\'re most alert and can focus on learning new things.',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'weekly' as const,
          daysOfWeek: [1, 2, 3, 4, 5],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Gratitude practice': {
        title: 'Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for each day',
        category: 'mindfulness' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Morning or evening works great. Choose a time when you can reflect peacefully.',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          customInterval: 1,
          customUnit: 'days' as const
        }
      },
      'Goal setting': {
        title: 'Weekly Goal Review',
        description: 'Review and adjust your goals weekly',
        category: 'productivity' as const,
        weeklyTarget: 1,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Pick a time when you can think clearly about your goals and plan ahead.',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'weekly' as const,
          daysOfWeek: [1], // Monday
          customInterval: 1,
          customUnit: 'weeks' as const
        }
      },
      'Drink Water': {
        title: 'Drink Water',
        description: '8 glasses throughout the day for optimal hydration',
        category: 'health' as const,
        weeklyTarget: 7,
        targetDuration: undefined, // User will set their own target duration
        targetTime: null, // Let user set their own time
        aiSuggestion: 'Set reminders throughout the day rather than specific times. Stay hydrated!',
        reminder: {
          enabled: false, // Let user enable and set their own reminder
          time: null,
          frequency: 'daily' as const,
          daysOfWeek: [1, 2, 3, 4, 5],
          customInterval: 1,
          customUnit: 'days' as const
        }
      }
    };

    // Convert each selected habit
    selectedHabits.forEach((habit, index) => {
      const habitKey = habit.toLowerCase();
      let habitObject = null;
      
      // Find matching habit pattern
      for (const [pattern, habitData] of Object.entries(habitMapping)) {
        if (habitKey.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(habitKey)) {
          habitObject = {
            ...habitData,
            id: Date.now().toString() + index.toString(),
            streak: 0,
            completedToday: false,
            currentWeekCompleted: 0,
            bestStreak: 0,
            completionRate: 0,
            aiGenerated: true,
            sourcePersonality: personalityName
          };
          break;
        }
      }
      
      // If no specific match found, create a generic habit
      if (!habitObject) {
        habitObject = {
          id: Date.now().toString() + index.toString(),
          title: habit,
          description: `Build consistency in ${habit.toLowerCase()}`,
          category: 'productivity' as const,
          weeklyTarget: 5,
          targetDuration: undefined, // User will set their own target duration
          targetTime: null, // Let user set their own time
          aiSuggestion: `Choose a time that works best for your schedule. Consistency is key for ${habit.toLowerCase()}!`,
          streak: 0,
          completedToday: false,
          currentWeekCompleted: 0,
          bestStreak: 0,
          completionRate: 0,
          reminder: {
            enabled: false, // Let user enable and set their own reminder
            time: null,
            frequency: 'daily' as const,
            daysOfWeek: [1, 2, 3, 4, 5],
            customInterval: 1,
            customUnit: 'days' as const
          },
          aiGenerated: true,
          sourcePersonality: personalityName
        };
      }
      
      habitObjects.push(habitObject);
    });

    return habitObjects;
  }
}

export const OnboardingFlow = ({ onComplete, user }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PersonalityData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track which question is currently shown - 0 for both questions
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    generation: '',
    gender: '',
    customGender: ''
  });

  const [personalitySelection, setPersonalitySelection] = useState<PersonalitySelection>({
    selectedPersonality: '',
    selectedHabits: []
  });



  const totalSteps = 2;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Questions array for progressive display
  const questions = [
    {
      id: 'generation',
      title: 'Pick your generation so I can understand you better!',
      options: generations,
      field: 'generation' as keyof PersonalInfo
    },
    {
      id: 'gender',
      title: 'How would you like me to refer to you?',
      options: genderOptions,
      field: 'gender' as keyof PersonalInfo
    }
  ];

  const handleQuestionAnswer = (questionId: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [questionId]: value }));
    
    // No need to move to next question since both are on same page
    // Just update the current question to show both are answered
    if (personalInfo.generation && personalInfo.gender && (personalInfo.gender !== 'custom' || personalInfo.customGender.trim())) {
      setCurrentQuestion(1); // Mark as completed
    }
  };

  const handleHabitToggle = (habit: string) => {
    setPersonalitySelection(prev => ({
      ...prev,
      selectedHabits: prev.selectedHabits.includes(habit)
        ? prev.selectedHabits.filter(h => h !== habit)
        : [...prev.selectedHabits, habit]
    }));
  };

  const handlePersonalitySelect = (personalityName: string) => {
    setPersonalitySelection(prev => ({ ...prev, selectedPersonality: personalityName }));
    // Auto-advance to habits selection after a short delay
    setTimeout(() => {
      // This will show the habits for the selected personality
    }, 500);
  };

  const handleGoBack = () => {
    if (personalitySelection.selectedPersonality) {
      // If showing habits, go back to personality selection
      setPersonalitySelection(prev => ({ ...prev, selectedPersonality: '' }));
    } else {
      // If on personality selection, go back to previous step
      setCurrentStep(0);
    }
  };

  const handleComplete = async () => {
    try {
      // Generate AI goals based on selected habits
      const aiService = AIGoalGenerationService.getInstance();
      const generatedGoals = aiService.generateGoalsFromHabits(
        personalitySelection.selectedHabits
      );

      // Convert selected habits to proper habit objects
      const habitService = HabitConversionService.getInstance();
      const generatedHabits = habitService.convertHabitsToObjects(
        personalitySelection.selectedHabits,
        personalitySelection.selectedPersonality
      );

      // Get selected personality data
      const selectedPersonalityData = famousPersonalities.find(p => p.name === personalitySelection.selectedPersonality) ||
        searchResults.find(p => p.name === personalitySelection.selectedPersonality);

      // Prepare onboarding data for backend
      const onboardingData = {
        userId: user.id || 1, // Use actual user ID from props
        firstName: personalInfo.firstName || user.name.split(' ')[0] || 'User',
        generation: personalInfo.generation,
        gender: personalInfo.gender,
        selectedPersonality: personalitySelection.selectedPersonality,
        personalityCategory: selectedPersonalityData?.category || 'Unknown',
        personalityDescription: 'Selected personality for habit building',
        personalityImage: selectedPersonalityData?.image || '/images/default-personality.jpg',
        personalityAchievements: [],
        selectedHabits: personalitySelection.selectedHabits,
        generatedHabits: generatedHabits,
        generatedGoals: generatedGoals,
        currentStep: 2,
        totalSteps: 2,
        isCompleted: true,
        skippedPersonality: false
      };

      // Validate onboarding data
      const validation = onboardingService.validateOnboardingData(onboardingData);
      if (!validation.isValid) {
        console.error('Onboarding validation failed:', validation.errors);
        // Still complete the flow locally even if backend fails
        const personalityProfile = {
          personalInfo,
          personalitySelection,
          generatedGoals,
          generatedHabits,
          generatedAt: new Date().toISOString()
        };
        onComplete(personalityProfile);
        return;
      }

      // Call backend API to create onboarding flow
      const response = await onboardingService.createOnboardingFlow(onboardingData);
      
      if (response.success) {
        console.log('Onboarding flow created successfully:', response.onboardingFlow);
      } else {
        console.error('Failed to create onboarding flow:', response.message);
      }

      // Complete the flow locally regardless of backend success
      const personalityProfile = {
        personalInfo,
        personalitySelection,
        generatedGoals,
        generatedHabits,
        generatedAt: new Date().toISOString(),
        onboardingFlowId: response.onboardingFlow?.id
      };
      onComplete(personalityProfile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback to local completion
      const personalityProfile = {
        personalInfo,
        personalitySelection,
        generatedGoals: [],
        generatedHabits: [],
        generatedAt: new Date().toISOString()
      };
      onComplete(personalityProfile);
    }
  };

  const handleSkipPersonality = async () => {
    try {
      // Create onboarding flow with skipped personality
      const onboardingData = {
        userId: user.id || 1,
        firstName: personalInfo.firstName || user.name.split(' ')[0] || 'User',
        generation: personalInfo.generation,
        gender: personalInfo.gender,
        selectedPersonality: '',
        personalityCategory: 'Skipped',
        personalityDescription: 'Personality selection skipped',
        personalityImage: '/images/default-personality.jpg',
        personalityAchievements: [],
        selectedHabits: [],
        generatedHabits: [],
        generatedGoals: [],
        currentStep: 2,
        totalSteps: 2,
        isCompleted: true,
        skippedPersonality: true
      };

      // Call backend API to create onboarding flow
      const response = await onboardingService.createOnboardingFlow(onboardingData);
      
      if (response.success) {
        console.log('Onboarding flow created successfully (skipped):', response.onboardingFlow);
      } else {
        console.error('Failed to create onboarding flow (skipped):', response.message);
      }

      // Complete the flow locally
      const personalityProfile = {
        personalInfo,
        personalitySelection: {
          selectedPersonality: '',
          selectedHabits: []
        },
        generatedAt: new Date().toISOString(),
        onboardingFlowId: response.onboardingFlow?.id
      };
      onComplete(personalityProfile);
    } catch (error) {
      console.error('Error completing onboarding (skipped):', error);
      // Fallback to local completion
      const personalityProfile = {
        personalInfo,
        personalitySelection: {
          selectedPersonality: '',
          selectedHabits: []
        },
        generatedAt: new Date().toISOString()
      };
      onComplete(personalityProfile);
    }
  };

  const selectedPersonalityData = famousPersonalities.find(p => p.name === personalitySelection.selectedPersonality) ||
    searchResults.find(p => p.name === personalitySelection.selectedPersonality);



  // AI Personality Search Functions
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(false);
    
    try {
      const aiService = AIPersonalityService.getInstance();
      const results = await aiService.searchPersonality(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to predefined personalities
      const fallbackResults = famousPersonalities.filter(personality =>
        personality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        personality.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(fallbackResults);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if ((window as any).searchTimeout) {
        clearTimeout((window as any).searchTimeout);
      }
    };
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    
    // Auto-search after user stops typing
    if (value.trim()) {
      (window as any).searchTimeout = setTimeout(() => {
        handleSearch();
      }, 1000);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  // Step 0: Personal Information (Progressive Questions)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-2 py-1">
        <Card className="w-full max-w-lg bg-white shadow-2xl border-2 border-green-100 rounded-3xl">
          <CardHeader className="text-center pb-2 pt-3">
            <div className="flex justify-center mb-2">
              <FriendlyChatbotLogo size={50} />
            </div>
            <CardTitle className="text-xl font-bold text-green-800">Let's Get To Know Each Other! 🤝</CardTitle>
            <p className="text-green-600 text-sm mt-1">I need to understand you better to create the perfect habit journey</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Show both questions on the same page */}
              {questions.map((question) => (
                <div 
                  key={question.id}
                  className="transition-all duration-500 ease-in-out opacity-100 transform translate-y-0"
                >
                  {/* Question Header with Edit Button */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-semibold text-base text-blue-900">
                      {question.title}
                    </div>
                    {personalInfo[question.field] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Clear the answer for this question to show options again
                          setPersonalInfo(prev => ({ ...prev, [question.field]: '' }));
                          // If it's custom gender, also clear that
                          if (question.field === 'gender') {
                            setPersonalInfo(prev => ({ ...prev, customGender: '' }));
                          }
                        }}
                        className="border-green-500 text-green-600 hover:bg-green-50 h-7 px-2 text-xs font-semibold rounded-lg"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {/* Question Options */}
                  {personalInfo[question.field] ? (
                    // Show selected option only
                    <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        {('emoji' in question.options.find(opt => opt.value === personalInfo[question.field])!) && (
                          <span className="text-lg">{(question.options.find(opt => opt.value === personalInfo[question.field]) as any).emoji}</span>
                        )}
                        <span className="font-semibold text-green-800 text-sm">
                          {question.options.find(opt => opt.value === personalInfo[question.field])?.label}
                        </span>
                        {personalInfo[question.field] === 'custom' && personalInfo.customGender && (
                          <span className="text-green-600 text-sm">({personalInfo.customGender})</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Show all options
                    <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-lg border border-blue-100">
                      {question.options.map(option => (
                        <button
                          key={option.value}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 text-blue-900 font-medium transition-all duration-200 text-sm"
                          onClick={() => handleQuestionAnswer(question.field, option.value)}
                        >
                          {('emoji' in option) && <span className="text-lg">{(option as any).emoji}</span>}
                          <span>{option.label}</span>
                        </button>
                      ))}
                      
                      {/* Custom gender input */}
                      {question.id === 'gender' && personalInfo.gender === 'custom' && (
                        <div className="mt-1">
                          <Input
                            value={personalInfo.customGender}
                            onChange={(e) => setPersonalInfo(prev => ({ ...prev, customGender: e.target.value }))}
                            className="border-green-200 focus:border-green-500 focus:ring-green-500 h-9 text-sm"
                            placeholder="How would you like to be addressed?"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Progress Indicator - Simplified for single page */}
              <div className="flex justify-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentQuestion >= 1 ? 'bg-green-500 scale-125' : 'bg-gray-300'
                }`} />
              </div>

              {/* Privacy Notice - Show after both questions are answered */}
              {personalInfo.generation && personalInfo.gender && (personalInfo.gender !== 'custom' || personalInfo.customGender.trim()) && (
                <div className="transition-all duration-500 ease-in-out opacity-100 transform translate-y-0">
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-2 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-2 h-2 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 text-xs">🔒 Your privacy is our priority</h4>
                        <p className="text-green-600 text-xs">We use this information to personalize your experience and never share it with third parties.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button - Show after both questions are answered */}
              {personalInfo.generation && personalInfo.gender && (personalInfo.gender !== 'custom' || personalInfo.customGender.trim()) && (
                <div className="transition-all duration-500 ease-in-out opacity-100 transform translate-y-0">
                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-8 font-semibold rounded-xl transition-all duration-300 scale-105 shadow-lg text-sm"
                    >
                      Next <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Personality-Based Habit Recommendation
  if (currentStep === 1) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-2 py-1">
          <Card className="w-full max-w-7xl bg-white shadow-2xl border-2 border-green-100 rounded-3xl">
            <CardHeader className="relative pb-1 pt-2 px-4 bg-gradient-to-r from-green-100 to-green-50 rounded-t-3xl border-b border-green-200">
              {/* Do it later button absolutely positioned */}
              <Button
                onClick={handleSkipPersonality}
                className="absolute top-2 right-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 h-8 px-4 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{minWidth: 'unset'}}
              >
                Do it later <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              {/* Centered headings in a column */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" style={{lineHeight: 1}}>🌟</span>
                  <CardTitle className="text-lg md:text-xl font-bold text-green-800 text-center m-0 p-0">Choose Your Role Model & Habits</CardTitle>
                </div>
                <p className="text-green-600 text-sm mt-1 mb-0 text-center">Search for any personality or select from our curated list!</p>
              </div>
              <Progress value={progress} className="mt-2 bg-[#4B2992] h-2" />
            </CardHeader>
            <CardContent className="px-2 mt-2">
              {!personalitySelection.selectedPersonality ? (
                <>
                  {/* AI-Powered Search Section */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-green-100 to-green-50 p-3 rounded-xl border border-green-200 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-green-500 rounded-full">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-green-800">🔍 AI-Powered Personality Search</h3>
                          <p className="text-green-600 text-xs">Search for any personality - I'll find them and their habits for you!</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                          <Input
                            type="text"
                            placeholder="Search for any personality (e.g., Narendra Modi, Elon Musk, Cristiano Ronaldo...)"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress}
                            className="pl-8 border-green-200 focus:border-green-500 focus:ring-green-500 h-9 text-sm"
                          />
                        </div>
                        <Button
                          onClick={handleSearch}
                          disabled={!searchQuery.trim() || isSearching}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-8 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg text-sm"
                        >
                          {isSearching ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-1" />
                              Search
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Search Results */}
                    {showSearchResults && (
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-green-800 mb-2">
                          {isSearching ? '🔍 Searching...' : searchResults.length > 0 ? '🎯 Search Results' : '❌ No Results Found'}
                        </h3>
                        
                        {isSearching ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="text-center">
                              <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto mb-2" />
                              <p className="text-green-600 text-sm">Searching for personalities...</p>
                            </div>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {searchResults.map((personality) => (
                              <div
                                key={personality.name}
                                onClick={() => handlePersonalitySelect(personality.name)}
                                className="p-3 rounded-xl border-2 border-green-200 cursor-pointer transition-all duration-300 hover:border-green-500 hover:shadow-xl hover:scale-105 bg-white relative"
                              >
                                <div className="absolute top-1 right-1">
                                  <div className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    AI Generated
                                  </div>
                                </div>
                                <div className="text-center">
                                  {personality.image ? (
                                    <img
                                      src={personality.image}
                                      alt={personality.name}
                                      className="w-12 h-12 rounded-full object-cover mx-auto mb-2 border-2 border-green-200"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <User className="w-6 h-6 text-white" />
                                    </div>
                                  )}
                                  <h3 className="text-lg font-bold text-green-800 mb-1">{personality.name}</h3>
                                  <p className="text-green-600 text-sm mb-1">{personality.category}</p>
                                  {personality.description && (
                                    <p className="text-xs text-green-500 italic">{personality.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-4xl mb-2">🤔</div>
                            <h4 className="text-base font-semibold text-green-800 mb-1">No personalities found</h4>
                            <p className="text-green-600 text-sm mb-3">Try searching for a different personality or browse our curated list below.</p>
                            <Button
                              onClick={() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                              }}
                              variant="outline"
                              className="border-green-500 text-green-600 hover:bg-green-50 h-8 px-4 font-semibold rounded-xl transition-all duration-300 text-sm"
                            >
                              Clear Search
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center my-3">
                      <div className="flex-1 border-t border-green-200"></div>
                      <span className="px-3 text-green-600 font-medium text-sm">OR</span>
                      <div className="flex-1 border-t border-green-200"></div>
                    </div>
                  </div>

                  {/* Predefined Personalities */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-green-800 mb-2">⭐ Curated Role Models</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {famousPersonalities.map((personality) => (
                        <div
                          key={personality.name}
                          onClick={() => handlePersonalitySelect(personality.name)}
                          className="p-2 rounded-xl border-2 border-green-200 cursor-pointer transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:scale-105 bg-white"
                        >
                          <div className="text-center">
                            {personality.image ? (
                              <img
                                src={personality.image}
                                alt={personality.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-green-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <User className="w-8 h-8 text-white" />
                              </div>
                            )}
                            <h3 className="text-base font-bold text-green-800 mb-1">{personality.name}</h3>
                            <p className="text-green-600 text-xs">{personality.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Previous button for personality selection */}
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      onClick={handleGoBack}
                      className="border-green-500 text-green-600 hover:bg-green-50 h-8 px-4 font-semibold rounded-xl transition-all duration-300 text-sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl border border-green-200">
                    <div className="text-center mb-3">
                      {selectedPersonalityData?.image && (
                        <img
                          src={selectedPersonalityData.image}
                          alt={selectedPersonalityData.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-3 border-green-200 shadow-lg"
                        />
                      )}
                      <h3 className="text-xl font-bold text-green-800 mb-1">
                        {selectedPersonalityData?.name}'s Habits
                      </h3>
                      <p className="text-green-600 text-sm">
                        Here are the top 10 habits that made {selectedPersonalityData?.name} successful
                      </p>
                    </div>
                    <p className="text-green-600 text-sm text-center">Select the habits you'd like to build. I'll help you master them step by step!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {selectedPersonalityData?.habits.map((habit, index) => (
                      <div
                        key={habit}
                        onClick={() => handleHabitToggle(habit)}
                        className={`p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          personalitySelection.selectedHabits.includes(habit)
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-green-200 bg-white hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                            personalitySelection.selectedHabits.includes(habit)
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`font-medium text-lg ${
                            personalitySelection.selectedHabits.includes(habit)
                              ? 'text-green-800'
                              : 'text-green-700'
                          }`} style={{ fontSize: '0.9rem' }}>
                            {habit}
                          </span>
                          {personalitySelection.selectedHabits.includes(habit) && (
                            <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      onClick={handleGoBack}
                      className="border-green-500 text-green-600 hover:bg-green-50 h-8 px-4 font-semibold rounded-xl transition-all duration-300 text-sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Selection
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-8 px-6 font-semibold rounded-xl transition-all duration-300 shadow-lg text-sm"
                    >
                      Complete Setup <Sparkles className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Dialog */}
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-800">🎯 Your Personalized Analysis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Based on your selections:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Generation: {generations.find(g => g.value === personalInfo.generation)?.label}</li>
                  <li>• Role Model: {personalitySelection.selectedPersonality}</li>
                  <li>• Selected Habits: {personalitySelection.selectedHabits.length}</li>
                </ul>
              </div>
              <p className="text-green-600">
                I'm creating your personalized habit-building journey. This will include tailored recommendations, 
                progress tracking, and AI-powered insights to help you succeed.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
};


